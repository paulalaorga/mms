import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { order } = req.body;

  if (!order || typeof order !== "string") {
    console.error("❌ Error: 'order' es inválido:", order);
    return res.status(400).json({ error: 'El campo "order" es obligatorio y debe ser una cadena' });
  }

  const apiToken = process.env.PAYCOMET_API_KEY;
  const terminal = process.env.PAYCOMET_TERMINAL; // 📌 Agregamos terminal desde .env

  if (!apiToken || !terminal) {
    console.error("❌ Error: PAYCOMET_API_KEY o PAYCOMET_TERMINAL no están definidas en .env");
    return res.status(500).json({ error: "Configuración de Paycomet incorrecta" });
  }

  // 📌 URL correcta con `order` en el path
  const url = `https://rest.paycomet.com/v1/payments/${order}/info`;

  console.log(`📢 Consultando estado del pago para la orden: ${order}`);
  console.log(`🔍 URL de consulta: ${url}`);

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "PAYCOMET-API-TOKEN": apiToken,
  };

  // 📌 Cuerpo de la solicitud con `terminal`
  const body = JSON.stringify({
    payment: {
      terminal: parseInt(terminal, 10), // Convertimos terminal a número
    },
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    console.log("🔄 Estado HTTP de Paycomet:", response.status);

    const textResponse = await response.text();
    console.log("📃 Respuesta de PAYCOMET (RAW):", textResponse);

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (jsonError) {
      console.error("⚠️ Error parseando JSON:", jsonError);
      return res.status(500).json({
        error: "La respuesta de Paycomet no es un JSON válido",
        rawResponse: textResponse,
      });
    }

    if (response.status !== 200 || data.errorCode) {
      console.error("❌ Error en PAYCOMET:", response.status, data);
      return res.status(response.status).json({ error: data });
    }

    console.log("✅ Respuesta de PAYCOMET:", JSON.stringify(data, null, 2));
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error en la consulta:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : error,
    });
  }
}
