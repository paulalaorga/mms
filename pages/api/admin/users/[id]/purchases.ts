import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/mongodb.mjs";
import User from "../../../../../models/User.mjs";
import PurchasedProgram from "../../../../../models/Purchase.mjs";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Falta el ID del usuario" });
  }

  try {
    if (req.method === "POST") {
      // Esta es la parte que añade una compra a un usuario
      const { programId, programName, description } = req.body;

      if (!programId || !programName) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      console.log(`➕ Agregando programa ${programId} al usuario ${id}`);

      // Crear la nueva compra
      const newPurchase = await PurchasedProgram.create({
        userId: new mongoose.Types.ObjectId(id),
        programId: new mongoose.Types.ObjectId(programId),
        programName,
        description,
        purchaseDate: new Date(),
      });

      // Actualizar el usuario añadiendo la nueva compra a `purchases`
      const user = await User.findByIdAndUpdate(
        id,
        { 
          $push: { 
            purchases: { 
              purchaseId: newPurchase._id, 
              purchaseType: "PurchasedProgram" 
            } 
          } 
        },
        { new: true }
      ).populate("purchases.purchaseId");

      return res.status(201).json({ message: "Programa agregado correctamente", user });
    }

    // Resto del código...
  } catch (error) {
    console.error("❌ Error procesando la solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}