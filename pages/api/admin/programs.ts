/* eslint-disable prefer-const */
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      let {
        programName,
        description,
        groupLevel,
        paymentOptions = [],
        hasIndividualSessions,
        individualSessionQuantity,
        expirationDate,
      } = req.body;

   

      // 🔹 Validaciones básicas
      if (!programName || !description || !groupLevel || !paymentOptions ||  !expirationDate) {
        return res
          .status(400)
          .json({
            error: "Todos los campos obligatorios deben estar presentes.",
          });
      }

      // 🔹 Validar que groupLevel sea correcto
      const validGroupLevels = ["Fundamental", "Avanzado"];
      if (!validGroupLevels.includes(groupLevel)) {
        return res
          .status(400)
          .json({
            error: "groupLevel inválido. Debe ser 'Fundamental', 'Avanzado'",
          });
      }

      // 🔹 Validar que al menos haya un precio
      if (!Array.isArray(paymentOptions)) {
        return res
          .status(400)
          .json({ error: "Debe definirse al menos un método de pago." });
      }

      // 🔹 Validar cada opción de pago
      for (const option of paymentOptions) {
        if (
          !option.type ||
          !["one-time", "subscription"].includes(option.type)
        ) {
          return res
            .status(400)
            .json({
              error:
                "Cada opción de pago debe tener un tipo válido ('one-time' o 'subscription').",
            });
        }
        if (option.price === undefined || option.price < 0) {
          return res
            .status(400)
            .json({
              error:
                "Cada opción de pago debe tener un precio válido mayor o igual a 0.",
            });
        }
        if (
          option.type === "subscription" &&
          (!option.subscriptionDetails || !option.subscriptionDetails.duration)
        ) {
          return res
            .status(400)
            .json({
              error:
                "subscriptionDetails es obligatorio para opciones de suscripción.",
            });
        }
      }

      const newProgram = new Program({
        programName,
        description,
        groupLevel,
        paymentOptions,
        hasIndividualSessions: hasIndividualSessions ?? false,
        individualSessionQuantity: hasIndividualSessions
          ? individualSessionQuantity
          : 0,
        expirationDate: null,
      });

      console.log("📝 Guardando en MongoDB:", newProgram);

      await newProgram.save();
      return res.status(201).json(newProgram);
    }

    if (req.method === "GET") {
      const programs = await Program.find({});

      // 🔹 Asegurar que cada programa tenga `paymentOptions` con valor válido
      const formattedPrograms = programs.map((program) => ({
        ...program.toObject(),
        paymentOptions: Array.isArray(program.paymentOptions)
          ? program.paymentOptions
          : [], // ✅ Si es undefined, lo convertimos en []
      }));

      return res.status(200).json(formattedPrograms);
    }

    if (req.method === "DELETE") {
      const { _id } = req.body;
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res
          .status(400)
          .json({ error: "El ID del programa es obligatorio." });
      }

      const deletedProgram = await Program.findByIdAndDelete(_id);

      if (!deletedProgram) {
        return res.status(404).json({ error: "Programa no encontrado." });
      }
      return res
        .status(200)
        .json({ message: "Programa eliminado correctamente." });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
