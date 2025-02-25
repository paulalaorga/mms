import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import { getPaymentStatus } from "@/services/paycomet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET" || req.method === "POST") {
    const { order } = req.query;

    if (!order || typeof order !== "string") {
      return res.status(400).json({ error: "Número de orden inválido" });
    }

    try {
      const paymentStatus = await getPaymentStatus(order);
      return res.status(200).json(paymentStatus);
    } catch (error) {
      console.error("Error al obtener estado del pago:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
