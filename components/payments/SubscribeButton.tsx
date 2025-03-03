import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";

interface SubscribeButtonProps {
  _id: Types.ObjectId;
  userName: string;
  programName: string;
  order?: string;
  price: number;
  subscriptionDuration: number | undefined;
  subscriptionRenewalPeriod: "monthly" | "yearly" | undefined;
  onSubscriptionSuccess?: () => void;
}

const SubscriptionButton: React.FC<SubscribeButtonProps> = ({ 
    _id,
    userName,
    programName,
    order,
    price,
    subscriptionDuration: duration,
    subscriptionRenewalPeriod: renewalPeriod,
    onSubscriptionSuccess,
 }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    setLoading(true);
    try {
      const userId = session?.user?.id || session?.user?.email;
      if (!userId) {
        alert("⚠️ No se pudo obtener la sesión del usuario. Intenta iniciar sesión de nuevo.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/paycomet/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          userId,
          userName,
          programName,
          amount: price,
          duration,
          renewalPeriod,
          orderId: order || `Suscripcion_${Date.now()}`,
        }),
      });

      const data = await response.json();
      if (data.subscription_url) {
        window.location.href = data.subscription_url;
        if (onSubscriptionSuccess) onSubscriptionSuccess();
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
    <Button onClick={handleSubscription} isLoading={loading} colorScheme="teal" size="md" width="100%" mt={4}>
      Suscríbete Ya
    </Button>
  );
};

export default SubscriptionButton;
