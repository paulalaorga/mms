import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import { getPaycometPayments } from "@/services/paycomet-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // TODO: Agregar validación de privilegios de administrador

  if (req.method === "GET" || req.method === "POST") {
    try {
      const payments = await getPaycometPayments();
      return res.status(200).json(payments);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
