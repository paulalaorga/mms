// services/paycomet.ts

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

export async function getPaymentStatus(order: string) {
  const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
  const payment = {
    order: order,
    terminal: process.env.PAYCOMET_TERMINAL,
  }

  if (!PAYCOMET_API_KEY) {
    throw new Error("La variable de entorno PAYCOMET_API_KEY no está definida");
  }

  const PAYCOMET_STATUS_ENDPOINT = `https://rest.paycomet.com/v1/payments/${order}/info`;

  console.log(`📢 Consultando estado del pago para la orden: ${order}`);

  const response = await fetch(PAYCOMET_STATUS_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY,
    },
    body: JSON.stringify({ payment }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error en PAYCOMET:", errorText);
    throw new Error(`Error en PAYCOMET: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("🔍 Respuesta de PAYCOMET:", data);
  return data;
}



export async function getPaycometPayments() {
  const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
  // Definimos el endpoint para operationSearch
  const PAYCOMET_SEARCH_ENDPOINT = "https://rest.paycomet.com/v1/payments/search";

  if (!PAYCOMET_API_KEY) {
    throw new Error("La variable de entorno PAYCOMET_API_KEY no está definida");
  }
  if (!process.env.PAYCOMET_TERMINAL) {
    throw new Error("La variable de entorno PAYCOMET_TERMINAL_ID no está definida");
  }

  const toDate = formatDateToPaycomet(new Date());
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  const fromDate = formatDateToPaycomet(fiveMonthsAgo);
  // Construimos el payload según la documentación
  // Ajusta los valores (fechas, montos, operaciones, etc.) según tus necesidades
  const payload = {
    currency: "EUR",
    fromDate, // Formato YmdHis
    toDate,     // Formato YmdHis
    terminal: Number(process.env.PAYCOMET_TERMINAL),
    operations: [1, 3, 9],            // Por ejemplo, 1 para Authorization
    sortOrder: "DESC",          // "ASC" para ascendente o "DESC" para descendente
    sortType: 1,                // 1: ordenar por fecha (según documentación)
    state: 1,                   // 1 para operación correcta, 0 fallida, 2 pendiente, etc.
    minAmount: 0,
    maxAmount: 100000,
    limit: 10000,               // Límite de resultados
    // Opcional: order: "PAY123456789", searchType: 1, etc.
  };

  console.log("📢 Consultando pagos reales desde Paycomet mediante operationSearch:", payload);

  const response = await fetch(PAYCOMET_SEARCH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error obteniendo pagos:", errorText);
  }

  const data = await response.json();
  console.log("🔍 Datos obtenidos:", data);
  return data;
}

// Helper para formatear la fecha
function formatDateToPaycomet(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}


