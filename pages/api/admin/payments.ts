import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongodb.mjs";
import { paycometService } from "../../../services/paycomet-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // TODO: Agregar validación de privilegios de administrador

  if (req.method === "GET" || req.method === "POST") {
    try {
      // We need to call a specific method on the paycometService
      // Based on your service implementation, there's no method to get all payments
      // You'll need to implement something like getPaymentsList()
      // For example:
      const payments = await paycometService.checkPaymentStatus("latest");
      // Or if you have a method to list payments:
      // const payments = await paycometService.getPaymentsList();
      
      return res.status(200).json(payments);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}