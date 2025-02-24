export const payWithPaycomet = async (amount: number, orderId: string) => {
    try {
      const response = await fetch("/api/paycomet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      });
  
      const data = await response.json();
      
      if (data && data.challengeUrl) {
        window.location.href = data.challengeUrl; // Redirige al usuario a la pasarela de pago
      } else {
        throw new Error("No se recibió una URL de pago.");
      }
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      throw new Error("No se pudo procesar el pago.");
    }
  };

export async function getPaycometPayments() {
  // Aquí implementarás la lógica para conectar con la API de Paycomet.
  // Utiliza variables de entorno para las credenciales y endpoints.
  // Por ejemplo:
  // const response = await fetch(process.env.PAYCOMET_API_URL + "/payments", { ... });
  // return await response.json();

  // Por ahora devolvemos un array dummy
  return [
    {
      paymentId: "123456",
      orderId: "order_001",
      amount: 250,
      currency: "EUR",
      status: "completed",
      date: "2025-02-24T12:00:00Z",
    },
  ];
}

  