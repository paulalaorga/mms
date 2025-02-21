import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongodb";
import EmailTemplate from "../../../models/EmailTemplate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const templates = await EmailTemplate.find();
      return res.status(200).json(templates);
    } catch (err) {
      console.error("❌ Error obteniendo plantillas:", err);
      return res.status(500).json({ message: "Error al obtener las plantillas" });
    }
  }

  if (req.method === "PUT") {
    const { id, subject, body } = req.body;

    if (!id || !subject || !body) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
      const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
        id,
        { subject, body },
        { new: true }
      );

      if (!updatedTemplate) {
        return res.status(404).json({ message: "Plantilla no encontrada" });
      }

      return res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("❌ Error actualizando plantilla:", error);
      return res.status(500).json({ message: "Error actualizando plantilla" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
