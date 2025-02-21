import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface PaycometResponse {
  errorCode: number;
  challengeUrl?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { amount, order } = req.body;

    if (!amount || !order) {
      console.error("❌ Error: Faltan parámetros obligatorios", { amount, order });
      return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
    const PAYCOMET_TERMINAL = process.env.PAYCOMET_TERMINAL;

    if (!PAYCOMET_API_KEY || !PAYCOMET_TERMINAL) {
      console.error("❌ Error: PAYCOMET_API_KEY o PAYCOMET_TERMINAL no están definidos");
      return res.status(500).json({ error: "Configuración de Paycomet incorrecta" });
    }

    console.log("📢 Enviando solicitud a PAYCOMET:", { amount, order });

    const response = await axios.post<PaycometResponse>(
      "https://rest.paycomet.com/v1/payments",
      {
        terminal: PAYCOMET_TERMINAL,
        order,
        methods: [1],
        amount: `${amount}`,
        currency: "EUR",
        originalIp: req.headers["x-forwarded-for"] || "127.0.0.1",
        productDescription: "Pago en nuestra plataforma",
        secure: "1",
        language: "es",
        subscription: {
          periodicity: "monthly",
          duration: 12,
        },
      },
      {
        headers: { "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY },
      }
    );

    console.log("🔄 Respuesta de PAYCOMET:", response.data);

    if (response.data.errorCode === 0 && response.data.challengeUrl) {
      return res.status(200).json({ challengeUrl: response.data.challengeUrl });
    } else {
      console.error("❌ Error en PAYCOMET:", response.data);
      return res.status(500).json({ error: `Error en PAYCOMET: ${response.data.errorCode}` });
    }
  } catch (err) {
    const error = err as Error; // 🔹 Hacemos un cast explícito a Error

    console.error("❌ Error en la API de Paycomet:", error.message);

    return res.status(500).json({
      error: "Error en la pasarela de pago",
      details: error.message,
    });
  }
}
