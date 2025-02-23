import { useState } from "react";
import { Button } from "@chakra-ui/react";

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

const PayButton: React.FC<PayButtonProps> = ({ programId, order }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const requestData = {
        // Nombre del programa para que el backend sepa cuál es
        // (y su precio interno).
        programId,
        // Order del pedido o generada en backend
        order: order || `ORDER_${Date.now()}`
      };

      console.log("📤 Enviando solicitud a /api/paycomet/form-initialize:", requestData);

      const response = await fetch("/api/paycomet/form-initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      console.log("🔄 Respuesta de /api/paycomet/form-initialize:", data);

      if (data.error) {
        alert("❌ Error al generar URL de pago: " + data.error);
      } else if (data.paymentUrl) {
        // Redirigimos al usuario a la página de Paycomet
        window.location.href = data.paymentUrl;
      } else {
        alert("⚠️ No se recibió paymentUrl");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de pago", error);
      alert("Hubo un problema al iniciar el pago.");
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
      Apúntate ya 
    </Button>
  );
};

export default PayButton;
