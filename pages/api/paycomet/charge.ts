import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Definimos la estructura esperada de la respuesta de PAYCOMET
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
      return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
    const PAYCOMET_TERMINAL_ID = process.env.PAYCOMET_TERMINAL_ID;

    // Enviamos la solicitud a PAYCOMET con el tipo de respuesta definido
    const response = await axios.post<PaycometResponse>(
      "https://rest.paycomet.com/v1/form",
      {
        operationType: "1",
        language: "es",
        terminal: PAYCOMET_TERMINAL_ID,
        payment: {
          terminal: PAYCOMET_TERMINAL_ID,
          order,
          methods: [1],
          amount: `${amount}`, // PAYCOMET requiere string
          currency: "EUR",
          originalIp: req.headers["x-forwarded-for"] || "127.0.0.1",
          productDescription: "Pago en nuestra plataforma",
          secure: "1",
          language: "es",
        }
      },
      {
        headers: { "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY }
      }
    );

    // Ahora TypeScript reconocerá que `response.data` tiene la estructura de `PaycometResponse`
    if (response.data.errorCode === 0 && response.data.challengeUrl) {
      return res.status(200).json({ challengeUrl: response.data.challengeUrl });
    } else {
      return res.status(500).json({ error: `Error en PAYCOMET: ${response.data.errorCode}` });
    }
  } catch (error) {
    console.error("Error en PAYCOMET:", error);
    return res.status(500).json({ error: "Error en la pasarela de pago" });
  }
}
