// components/payments/PayButton.tsx
import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

interface PayButtonProps {
  programId: string;
  name: string;
  price: number;
  paymentType: "subscription" | "one-time";
  subscriptionDetails?: {
    periodicity: string;
    duration: number;
  };
 order?: string;
}

const PayButton: React.FC<PayButtonProps> = ({
  programId,
  price,
  paymentType,
  subscriptionDetails,
  order,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (!session?.user) {
        toast({
          title: "Necesitas iniciar sesión",
          description: "Por favor, inicia sesión para continuar con el pago",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      // Construimos el body para el endpoint
      const requestData = {
        amount: price,
        programId,
        name: `${session.user.name} - ${name}`,
        paymentType,
        subscriptionDetails,
        orderId: order || `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      };

      const response = await fetch("/api/paycomet/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error al procesar el pago",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (data.payment_url) {
        // Registrar la intención de compra en la base de datos
        await fetch("/api/subscriptions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programId,
            programName: name,
            amount: price,
            paymentType,
            orderId: requestData.orderId,
            subscriptionDetails
          }),
        });
        
        // Redirige al 3DS page de Paycomet
        window.location.href = data.payment_url;
      } else {
        toast({
          title: "Respuesta inesperada",
          description: "No se recibió payment_url del servidor",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de pago", error);
      toast({
        title: "Error en el proceso de pago",
        description: "Hubo un problema al iniciar el pago. Inténtalo de nuevo más tarde.",
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
      onClick={handlePayment} 
      isLoading={loading} 
      colorScheme="teal" 
      size="md" 
      width="100%" 
      mt={4}
    >
      {paymentType === "one-time" ? "Pagar una vez" : "Suscribirse"}
    </Button>
  );
};

export default PayButton;