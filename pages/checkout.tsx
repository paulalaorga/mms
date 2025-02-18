import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();
  const { order, amount } = router.query;

  useEffect(() => {
    // Generar un nuevo número de orden si no existe
    const newOrder = order || `TEST-${Date.now()}`;

    if (!amount) {
      console.error("❌ Falta el monto del pago");
      router.replace("/error");
      return;
    }

    async function initiatePayment() {
      try {
        console.log("🔍 Iniciando pago con:", { order: newOrder, amount });

        const res = await fetch("/api/paycomet/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder, amount }),
        });

        if (!res.ok) {
          throw new Error(`Error en el servidor: ${res.status}`);
        }

        const data = await res.json();
        console.log("📌 Challenge URL recibido:", data.challengeUrl);

        if (data.challengeUrl) {
          router.replace(data.challengeUrl);
        } else {
          console.error("❌ No se recibió un `challengeUrl` válido.");
          router.replace("/payment-failed");
        }
      } catch (error) {
        console.error("❌ Error al iniciar el pago:", error);
        router.replace("/payment-failed");
      }
    }

    initiatePayment();
  }, [order, amount, router]);

  return <p>Redirigiendo al pago...</p>;
}
