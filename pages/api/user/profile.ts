import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import User from "@/models/User";
import { authOptions }  from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: "No autenticado" });
  }

  // Verificar si es un ObjectId válido
  if (mongoose.Types.ObjectId.isValid(session.user.id)) {
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } else {
    return res.status(200).json({
      message: "Este usuario proviene de Google y no tiene un _id en la DB",
      userData: {
        email: session.user.email,
      },
    });
  }
}
