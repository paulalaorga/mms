import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface TokenizeResponse {
  idUser: string;
  tokenUser: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { cardNumber, expiryDate, cvv } = req.body;

    if (!cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ error: "Faltan datos de la tarjeta" });
    }

    // Variables de entorno
    const PAYCOMET_API_URL = `${process.env.PAYCOMET_BASE_URL}v1/cards`;
    const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
    const PAYCOMET_TERMINAL_ID = process.env.PAYCOMET_TERMINAL_ID;

    // Datos de la tarjeta a tokenizar
    const requestBody = {
      terminal: PAYCOMET_TERMINAL_ID,
      cardNumber,
      expiryDate,
      cvv
    };

    console.log("📤 Enviando datos de tarjeta a Paycomet:", requestBody);

    // Enviar solicitud a Paycomet
    const response = await axios.post<TokenizeResponse>(PAYCOMET_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${PAYCOMET_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return res.status(200).json(response.data);

  } catch (error: unknown) {
    console.error("❌ ERROR AL TOKENIZAR TARJETA:", error);

    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response: { data: { error: string } } };
      return res.status(500).json({ error: axiosError.response.data.error || "Error en Paycomet" });
    }

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Error desconocido en Paycomet" });
  }
}
