import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  async function iniciarPago() {
    setLoading(true);
    try {
      const response = await fetch("/api/paycomet/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50, order: "ORDER12345" }), // 50€ de pago
      });

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // Redirige a Paycomet
      } else {
        console.error("Error en la generación del pago", data);
      }
    } catch (error) {
      console.error("Error al procesar el pago", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Compra una sesión de terapia</h1>
      <button
        onClick={iniciarPago}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Procesando..." : "Pagar 50€"}
      </button>
    </div>
  );
}
