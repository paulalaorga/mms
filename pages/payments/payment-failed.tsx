import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";

interface SubscribeButtonProps {
  _id: Types.ObjectId;
  userName: string;
  programName: string;
  price: number;
  subscriptionDuration?: number;
  subscriptionRenewalPeriod?: "monthly" | "yearly";
  order?: string;
  onSubscriptionSuccess?: () => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  _id,
  userName,
  programName,
  price,
  subscriptionDuration = 12, // Por defecto 12 meses
  subscriptionRenewalPeriod = "monthly", // Por defecto mensual
  order,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubscription = async () => {
    setLoading(true);
    
    try {
      if (!session?.user) {
        toast({
          title: "Necesitas iniciar sesión",
          description: "Por favor, inicia sesión para continuar con la suscripción",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Crear un ID de orden único si no se proporcionó uno
      const orderId = order || `SUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Registrar la intención de suscripción en la base de datos
      await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: _id,
          programName,
          amount: price,
          paymentType: "subscription",
          orderId,
          subscriptionDetails: {
            duration: subscriptionDuration,
            periodicity: subscriptionRenewalPeriod === "monthly" ? "1m" : "1y"
          }
        }),
      });

      // Preparar detalles de la suscripción para Paycomet
      const subscriptionDetails = {
        periodicity: subscriptionRenewalPeriod === "monthly" ? "1m" : "1y",
        duration: subscriptionDuration
      };

      // Inicializar el pago con Paycomet
      const response = await fetch("/api/paycomet/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          orderId,
          programId: _id,
          paymentType: "subscription",
          description: `Suscripción a ${programName} de ${userName}`,
          subscriptionDetails
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      } else if (data.payment_url) {
        // Redirige al formulario de pago de Paycomet
        window.location.href = data.payment_url;
      } else {
        throw new Error("No se recibió URL de pago desde el servidor");
      }
    } catch (error) {
      console.error("❌ Error en la suscripción:", error);
      toast({
        title: "Error en el proceso de suscripción",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar la suscripción",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscription}
      isLoading={loading}
      colorScheme="purple"
      size="md"
      width="100%"
      mt={4}
    >
      Suscribirse por {price}€/{subscriptionRenewalPeriod === "monthly" ? "mes" : "año"}
    </Button>
  );
};

export default SubscribeButton;