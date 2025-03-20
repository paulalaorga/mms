// pages/api/admin/users/[id]/purchases.ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/mongodb.ts";
import User from "../../../../../models/User.ts";
import PurchasedProgram from "../../../../../models/Purchase.ts";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Falta el ID del usuario" });
  }

  try {
    // Método POST: Agregar programa al usuario
    if (req.method === "POST") {
      const { programId, programName, description } = req.body;

      if (!programId || !programName) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      console.log(`➕ Agregando programa ${programId} al usuario ${id}`);

      // Validar que programId sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(programId)) {
        console.error(`❌ ID de programa inválido: ${programId}`);
        return res.status(400).json({ message: "ID de programa inválido" });
      }

      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        console.error(`❌ Usuario no encontrado: ${id}`);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Crear la nueva compra
      try {
        const newPurchase = await PurchasedProgram.create({
          userId: new mongoose.Types.ObjectId(id),
          programId: new mongoose.Types.ObjectId(programId),
          programName,
          description: description || "",
          purchaseDate: new Date(),
        });

        console.log(`✅ Programa creado: ${newPurchase._id}`);

        // Actualizar el usuario agregando la nueva compra
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { 
            $push: { 
              purchases: { 
                purchaseId: newPurchase._id, 
                purchaseType: "PurchasedProgram" 
              } 
            },
            // Marcar como paciente al agregar un programa
            $set: { isPatient: true }
          },
          { new: true }
        ).populate("purchases.purchaseId");

        console.log(`✅ Usuario actualizado: ${updatedUser?._id}`);

        return res.status(201).json({ message: "Programa agregado correctamente", user: updatedUser });
      } catch (error) {
        console.error(`❌ Error al crear la compra:`, error);
        return res.status(500).json({ message: "Error al crear la compra" });
      }
    }

    // Método DELETE: Eliminar programa del usuario
    if (req.method === "DELETE") {
      const { purchaseId } = req.body;
      if (!purchaseId) {
        return res.status(400).json({ message: "Falta el ID de la compra" });
      }

      console.log(`🗑 Eliminando compra ${purchaseId} del usuario ${id}`);

      // Validar que purchaseId sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
        console.error(`❌ ID de compra inválido: ${purchaseId}`);
        return res.status(400).json({ message: "ID de compra inválido" });
      }

      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        console.error(`❌ Usuario no encontrado: ${id}`);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Eliminar la compra de la relación en el usuario
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { purchases: { purchaseId: new mongoose.Types.ObjectId(purchaseId) } } },
        { new: true }
      ).populate("purchases.purchaseId");

      // Eliminar el documento de compra
      await PurchasedProgram.findByIdAndDelete(purchaseId);

      console.log(`✅ Compra eliminada y usuario actualizado: ${updatedUser?._id}`);

      return res.status(200).json({ message: "Compra eliminada correctamente", user: updatedUser });
    }

    return res.status(405).json({ message: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error procesando la solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor", error: String(error) });
  }
}