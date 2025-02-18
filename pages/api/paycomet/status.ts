import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { order } = req.query;
    if (!order || typeof order !== "string") {
      return res.status(400).json({ error: "Falta el número de orden o no es válido" });
    }

    const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
    console.log(`📢 Consultando estado del pago para la orden: ${order}`);

    // Realizamos la petición con fetch
    const response = await fetch(`https://rest.paycomet.com/v1/form/status?order=${order}`, {
      method: "GET",
      headers: { "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY || "" },
    });

    if (!response.ok) {
      console.error("❌ Error en PAYCOMET:", response.statusText);
      return res.status(response.status).json({ error: `Error en PAYCOMET: ${response.statusText}` });
    }

    const data = await response.json();
    console.log("🔍 Respuesta de PAYCOMET:", data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("❌ Error en la verificación de pago:", error);
    return res.status(500).json({ error: "Error interno en la verificación de pago" });
  }
}
