import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PurchasedProgram from "@/models/Purchase";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Falta el ID del usuario" });
  }

  try {
    if (req.method === "POST") {
      const { programId, programName, description } = req.body;

      if (!programId || !programName) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      console.log(`➕ Agregando programa ${programId} al usuario ${id}`);

      const newPurchase = await PurchasedProgram.create({
        userId: new mongoose.Types.ObjectId(id),
        programId: new mongoose.Types.ObjectId(programId),
        programName,
        description,
        purchaseDate: new Date(),
      });

      const user = await User.findByIdAndUpdate(
        id,
        { $push: { purchases: newPurchase._id } },
        { new: true }
      );

      return res.status(201).json({ message: "Programa agregado correctamente", user });
    }

    if (req.method === "DELETE") {
      const { purchaseId } = req.body;
      if (!purchaseId) {
        return res.status(400).json({ message: "Falta el ID de la compra" });
      }

      console.log(`🗑 Eliminando compra ${purchaseId} del usuario ${id}`);

      const user = await User.findByIdAndUpdate(
        id,
        { $pull: { purchases: new mongoose.Types.ObjectId(purchaseId) } },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      await PurchasedProgram.findByIdAndDelete(purchaseId);

      return res.status(200).json({ message: "Compra eliminada correctamente", user });
    }

    return res.status(405).json({ message: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error procesando la solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
