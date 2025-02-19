import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("➡️ API llamada para obtener un usuario");
  console.log("➡️ Método de la solicitud:", req.method);
  console.log("➡️ Query Params:", req.query); // Log para ver el ID recibido

  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let { id } = req.query;

  // Si el ID viene en array, tomar el primer elemento
  if (Array.isArray(id)) {
    id = id[0];
  }

  console.log("🔍 ID recibido antes de validación:", id);

  // Verificar si el ID es válido antes de hacer la consulta
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ ID inválido recibido:", id);
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(`🔎 Buscando usuario con ObjectId: ${objectId}`);

    const user = await User.findOne({ _id: objectId }).select("-password");

    if (!user) {
      console.warn(`⚠️ Usuario con ID ${id} no encontrado.`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("✅ Usuario encontrado:", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}
