import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";

interface PayButtonProps {
  _id: Types.ObjectId;
  userName: string;
  programName: string;
  price: number;
  expirationDate?: Date;
  order?: string;
  onPaymentSuccess?: () => void;
}

const PayButton: React.FC<PayButtonProps> = ({ 
  _id,
  userName,
  programName,
  price,
  order
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

      // Crear un ID de orden único si no se proporcionó uno
      const orderId = order || `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Registrar la intención de compra en la base de datos
      await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: _id,
          programName,
          amount: price,
          paymentType: "one-time",
          orderId
        }),
      });

      // Inicializar el pago con Paycomet
      const response = await fetch("/api/paycomet/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          orderId,
          programId: _id,
          paymentType: "one-time",
          description: `Pago por el programa ${programName} de ${userName}`
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
      console.error("❌ Error en el pago:", error);
      toast({
        title: "Error en el proceso de pago",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar el pago",
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
      Pagar {price}€
    </Button>
  );
};

export default PayButton;