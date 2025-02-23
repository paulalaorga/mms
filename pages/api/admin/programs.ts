import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      const {
        name,
        description,
        groupLevel,
        paymentType,
        billingFrequency,
        billingCycles,
        pricingOptions, // Se espera solo este campo para los precios
      } = req.body;

      // Validaciones básicas
      if (!name || !description || !groupLevel || !paymentType) {
        console.error("❌ Datos inválidos recibidos:", req.body);
        return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes." });
      }

      // Para pago único, podrías validar que pricingOptions contenga la opción correcta,
      // por ejemplo, que exista una opción con period "yearly" o alguna otra convención.
      // Esto depende de tu lógica de negocio.

      const newProgram = new Program({
        name,
        description,
        groupLevel,
        paymentType,
        billingFrequency: billingFrequency ?? null,
        billingCycles: billingCycles ?? null,
        pricingOptions: pricingOptions ?? [],
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
