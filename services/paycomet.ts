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

  