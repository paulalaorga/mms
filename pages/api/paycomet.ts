import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const PAYCOMET_BASE_URL = process.env.PAYCOMET_BASE_URL;
const PAYCOMET_TERMINAL_ID = process.env.PAYCOMET_TERMINAL_ID;
const PAYCOMET_PASSWORD = process.env.PAYCOMET_PASSWORD;
const PAYCOMET_MERCHANT_CODE = process.env.PAYCOMET_MERCHANT_CODE;
const PAYCOMET_URL_OK = process.env.PAYCOMET_URL_OK;
const PAYCOMET_URL_KO = process.env.PAYCOMET_URL_KO;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ error: "El monto y el ID de orden son obligatorios." });
  }

  try {
    console.log("🔹 Enviando solicitud a Paycomet con:");
    console.log("💳 Monto:", amount);
    console.log("🆔 Order ID:", orderId);
    console.log("📡 URL Base:", PAYCOMET_BASE_URL);
    console.log("🔑 Terminal ID:", PAYCOMET_TERMINAL_ID);
    console.log("🔑 Merchant Code:", PAYCOMET_MERCHANT_CODE);
    console.log("🔑 Password:", PAYCOMET_PASSWORD ? "Cargada ✅" : "No encontrada ❌");

    // Intentamos enviar con Headers de Autenticación en caso de que Paycomet lo requiera
    const response = await axios.post(
      `${PAYCOMET_BASE_URL}/payments`,
      {
        terminal: PAYCOMET_TERMINAL_ID,
        merchant: PAYCOMET_MERCHANT_CODE,
        amount: amount * 100, // Paycomet usa valores en céntimos
        order: orderId,
        currency: "EUR",
        userInteraction: 1,
        urlOk: PAYCOMET_URL_OK,
        urlKo: PAYCOMET_URL_KO,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${PAYCOMET_TERMINAL_ID}:${PAYCOMET_PASSWORD}`).toString("base64")}`,
        },
      }
    );

    console.log("✅ Respuesta de Paycomet:", response.data);
    res.status(200).json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error al generar el pago con Paycomet:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("❌ Error desconocido:", error);
      res.status(500).json({ error: "Error inesperado en el servidor." });
    }
  }
}
