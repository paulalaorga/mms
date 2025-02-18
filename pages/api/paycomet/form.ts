import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const PAYCOMET_MERCHANT = process.env.PAYCOMET_MERCHANT_CODE!;
const PAYCOMET_TERMINAL = process.env.PAYCOMET_TERMINAL_ID!;
const PAYCOMET_PASSWORD = process.env.PAYCOMET_PASSWORD!;
const PAYCOMET_BASE_URL = "https://secure.paycomet.com/gateway/form.html";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { amount, order } = req.body;

  if (!amount || !order) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  const currency = 978; // EUR
  const amountInCents = amount * 100; // Convertir a céntimos

  // 🔹 Generar firma de seguridad SHA-512
  const signature = crypto
    .createHash("sha512")
    .update(`${PAYCOMET_MERCHANT}${PAYCOMET_TERMINAL}${amountInCents}${currency}${order}${PAYCOMET_PASSWORD}`)
    .digest("hex");

  // 🔹 Construir URL de pago
  const paymentUrl = `${PAYCOMET_BASE_URL}?MERCHANT=${PAYCOMET_MERCHANT}&TERMINAL=${PAYCOMET_TERMINAL}&AMOUNT=${amountInCents}&CURRENCY=${currency}&ORDER=${order}&SIGNATURE=${signature}`;

  return res.status(200).json({ paymentUrl });
}
