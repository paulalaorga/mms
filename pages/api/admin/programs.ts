/* eslint-disable prefer-const */
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";

interface PricingOption {
  period: string;
  price: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      let {
        name,
        description,
        groupLevel,
        paymentType,
        billingFrequency,
        billingCycles,
        pricingOptions,
        hasIndividualSessions,
        individualSession,
      } = req.body;

      // Validaciones básicas: si faltan campos obligatorios, se retorna error
      if (!name || !description || !groupLevel || !paymentType) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes." });
      }

      // Verificación: si alguna opción de precio tiene period "yearly", se convierte a pago único
      if (pricingOptions && pricingOptions.some((option: PricingOption) => option.period === "yearly")) {
        paymentType = "one-time";
      }

      const newProgram = new Program({
        name,
        description,
        groupLevel,
        paymentType,
        billingFrequency: billingFrequency ?? null,
        billingCycles: billingCycles ?? null,
        pricingOptions: pricingOptions ?? [],
        hasIndividualSessions: hasIndividualSessions ?? false,
        individualSession: individualSession ?? null,
      });

      await newProgram.save();
      return res.status(201).json(newProgram);
    }

    if (req.method === "GET") {
      const programs = await Program.find({});
      console.log("Programas obtenidos:", programs);
      return res.status(200).json(programs);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "El ID del programa es obligatorio." });
      }
      const deletedProgram = await Program.findByIdAndDelete(id);
      if (!deletedProgram) {
        return res.status(404).json({ error: "Programa no encontrado." });
      }
      return res.status(200).json({ message: "Programa eliminado correctamente." });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
