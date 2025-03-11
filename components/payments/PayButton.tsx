import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";

interface PayButtonProps {
  _id: Types.ObjectId;
  userName: string;
  programName: string;
  price: number;
  expirationDate: Date | undefined;
  onPaymentSuccess?: () => void;
}

const PayButton: React.FC<PayButtonProps> = ({ _id, userName, programName, price, onPaymentSuccess }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const userId = session?.user?.id || session?.user?.email;
      

      if (!userId) {
        alert("⚠️ No se pudo obtener la sesión del usuario. Intenta iniciar sesión de nuevo.");
        setLoading(false);
        return;
      }

      const orderCounter = await fetch("/api/payments/generate-order", { method: "POST" });
      const orderCounterData = await orderCounter.json();

      if (!orderCounterData.orderId) {
        alert("⚠️ No se pudo generar un número de orden. Inténtalo de nuevo más tarde.");
        setLoading(false);
        return;
      }

      const orderId = orderCounterData.orderId;

      const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      const paymentData = {
          _id,
          userId,
          userName,
          programName,
          amount: price,
          orderId,
          expirationDate,
        };
      console.log("🔹 Datos de pago:", paymentData)
      
      const response = await fetch("/api/payments/onepayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      
      if (data.payment_url) {
        window.location.href = data.payment_url;

        await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...paymentData,
            paymentUrl: data.payment_url
          }),
        });
        
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        alert("⚠️ No se recibió una URL de pago válida.");
      }
    } catch (error) {
      console.error("❌ Error en el pago único", error);
      alert("Hubo un problema al iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} isLoading={loading} colorScheme="teal" size="md" width="100%" mt={4}>
      Pagar Ahora
    </Button>
  );
};

export default PayButton;
