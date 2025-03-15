import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongodb.mjs";
import { paycometService } from "../../../services/paycomet-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET" || req.method === "POST") {
    const { order } = req.query;

    if (!order || typeof order !== "string") {
      return res.status(400).json({ error: "Número de orden inválido" });
    }

    try {
      // Use the correct method from the service instance
      const paymentStatus = await paycometService.checkPaymentStatus(order);
      return res.status(200).json(paymentStatus);
    } catch (error) {
      console.error("Error al obtener estado del pago:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}