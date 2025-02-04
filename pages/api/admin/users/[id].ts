import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.query;

  // Validar que el ID es un ObjectId válido
  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el usuario" });
  }
}
