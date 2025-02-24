import { useState } from "react";
import { Button } from "@chakra-ui/react";
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
  name,
  price,
  paymentType,
  subscriptionDetails,
  order,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Construimos el body para el endpoint
      const requestData = {
        amount: price,
        programId,
        name: session?.user?.name + name,             
        paymentType,         // "one-time" o "subscription"
        subscriptionDetails, // { periodicity, duration } si aplica
        orderId: order || `ORDER_${Date.now()}`,
      };

      const response = await fetch("/api/paycomet/form-initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.error) {
        alert("❌ Error al generar URL de pago: " + data.error);
      } else if (data.payment_url) {
        // Redirige al 3DS page de Paycomet
        window.location.href = data.payment_url;
      } else {
        alert("⚠️ No se recibió payment_url");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de pago", error);
      alert("Hubo un problema al iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} isLoading={loading} colorScheme="teal" size="md" width="100%" mt={4}>
      {paymentType === "one-time" ? "Pagar una vez" : "Suscribirse"}
    </Button>
  );
};

export default PayButton;
