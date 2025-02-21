import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const PAYCOMET_API_URL = "https://api.paycomet.com/gateway/json";
const MERCHANT_CODE = process.env.PAYCOMET_MERCHANT_CODE;
const TERMINAL = process.env.PAYCOMET_TERMINAL;
const PASSWORD = process.env.PAYCOMET_PASSWORD;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { amount, currency, order, description, subscription } = req.body;

    if (!amount || !currency || !order || !description) {
      return res.status(400).json({ error: "Datos insuficientes" });
    }

    let transactionData: Record<string, string | number | undefined> = {
      merchantCode: MERCHANT_CODE,
      terminal: TERMINAL,
      password: PASSWORD,
      amount: amount * 100, // Paycomet maneja los precios en céntimos
      order,
      currency: "978", // Código de Euro en ISO 4217
      userInteraction: 1,
      urlOk: `${BASE_URL}/payments/success`,
      urlKo: `${BASE_URL}/payments/failure`,
      concept: description,
    };

    // Si es suscripción, agregamos los datos correspondientes
    if (subscription) {
      transactionData = {
        ...transactionData,
        periodicity: subscription.periodicity,
        cycles: subscription.duration.toString(),
      };
    }

    const response = await axios.post(`${PAYCOMET_API_URL}/createPayment`, transactionData);
    
    // Asegurar que la respuesta es del tipo esperado
    if (typeof response.data !== "object" || response.data === null) {
      throw new Error("Respuesta inesperada de Paycomet");
    }

    const data = response.data as { errorCode: number; url?: string };

    if (data.errorCode !== 0) {
      throw new Error(`Error Paycomet: ${data.errorCode}`);
    }

    res.status(200).json({ payment_url: data.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: "Error al crear el pago", details: errorMessage });
  }
}
