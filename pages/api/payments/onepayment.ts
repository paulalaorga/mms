
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import connectDB from "@/lib/mongodb"; // Donde guardaste el helper
import Program from "@/models/Program";

// Variables de entorno
const PAYCOMET_API_URL = process.env.PAYCOMET_BASE_URL!;
const PAYCOMET_API_TOKEN = process.env.PAYCOMET_API_KEY!;
const TERMINAL = process.env.PAYCOMET_TERMINAL!;
const PAYCOMET_URL_OK = process.env.PAYCOMET_URL_OK!;
const PAYCOMET_URL_KO = process.env.PAYCOMET_URL_KO!;

interface PaycometPaymentResponse {
  errorCode: number;
  challengeUrl?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await connectDB();
    const { _id, userId, amount, orderId, programName, userName } = req.body;

    if (!userId || !amount || !orderId) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    console.log("🔹 Datos recibidos en `onepayment.ts`:", req.body);

    const program = await Program.findById(_id);
    if (!program) {
      return res.status(400).json({ error: "El programa no existe." });
    }

    const payload = {
      operationType: 1,
      language: "es",
      terminal: Number(TERMINAL),
      payment: {
        terminal: Number(TERMINAL),
        methods: [],
        excludedMethods: [],
        order: orderId,
        amount: Math.round(amount * 100).toString(),
        currency: "EUR",
        secure: 1,
        scoring: "0",
        productDescription: `Pago de ${userName}`,
        userInteraction: 1,
        urlOk: `${PAYCOMET_URL_OK}?userId=${userId}&programId=${_id}&orderId=${orderId}&programName=${encodeURIComponent(programName)}&userName=${encodeURIComponent(userName)}&amount=${amount}&currency=EUR`,
        urlKo: PAYCOMET_URL_KO,
        tokenize: 0,
      },
    };

    console.log("🔹 Payload a Paycomet:", payload);

    const paymentResponse = await axios.post<PaycometPaymentResponse>(`${PAYCOMET_API_URL}/v1/form`, payload, {
      headers: {
        "Content-Type": "application/json",
        "PAYCOMET-API-TOKEN": PAYCOMET_API_TOKEN,
      },
    });

    const { challengeUrl } = paymentResponse.data;
    return res.status(200).json({ payment_url: challengeUrl });

  } catch (error) {
    console.error("❌ Error en `onepayment.ts`:", error);
    return res.status(500).json({ error: "Error en el servidor", details: error instanceof Error ? error.message : "Error desconocido" });
  }
}


