import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import { getPaycometPayments } from "@/services/paycomet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Validación de privilegios de administrador (pendiente de implementación)

  if (req.method === "GET") {
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
