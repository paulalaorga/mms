import { useState } from "react";

const PayButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/paycomet/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 50, // Precio en euros
          currency: "EUR",
          order: `ORDER_${Date.now()}`,
          description: "Sesión de terapia",
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
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Procesando..." : "Pagar con Paycomet"}
    </button>
  );
};

export default PayButton;
