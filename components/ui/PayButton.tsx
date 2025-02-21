import { useState } from "react";
import { Button } from "@chakra-ui/react";

interface PayButtonProps {
  name: string;
  price: number;
}

const PayButton: React.FC<PayButtonProps> = ({ name, price }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/paycomet/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price, // Precio en euros
          currency: "EUR",
          order: `ORDER_${Date.now()}`,
          description: `Suscripción a ${name}`,
          subscription: {
            periodicity: "monthly", // Pago mensual
            duration: 12, // 12 meses
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Error en el pago: " + data.error);
      } else {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error("Error en la solicitud de pago", error);
      alert("Hubo un problema con el pago");
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
      Suscribirse por {price}€/mes
    </Button>
  );
};

export default PayButton;
