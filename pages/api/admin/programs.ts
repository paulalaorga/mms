import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      const { name, description, groupLevel, price, paymentType, billingFrequency, billingCycles } = req.body;

      // 🔍 Validaciones antes de guardar
      if (!name || !description || !groupLevel || price === undefined || !paymentType) {
        console.error("❌ Datos inválidos recibidos:", req.body);
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      const newProgram = new Program({
        name,
        description,
        groupLevel,
        price,
        paymentType,
        billingFrequency: billingFrequency ?? null, // ✅ Opcional
        billingCycles: billingCycles ?? null, // ✅ Opcional
      });

      await newProgram.save();
      return res.status(201).json(newProgram);
    }

    if (req.method === "GET") {
      const programs = await Program.find({});
      return res.status(200).json(programs);
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
