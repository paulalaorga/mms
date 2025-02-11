import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/mongodb"; // 🔹 Asegura la conexión antes de consultar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  await connectDB(); // 🔹 Asegurar conexión antes de cualquier operación

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  let user;
  if (mongoose.Types.ObjectId.isValid(session.user.id)) {
    user = await User.findById(session.user.id);
  } else {
    user = await User.findOne({ email: session.user.email }); // 🔹 Buscar por email si es usuario de Google
  }

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  // Actualizar datos del usuario
  const { name, surname, dni, phone, contractSigned, recoveryContact } = req.body;
  user.name = name || user.name;
  user.surname = surname || user.surname;
  user.dni = dni || user.dni;
  user.phone = phone || user.phone;
  user.contractSigned = contractSigned ?? user.contractSigned;
  user.recoveryContact = recoveryContact || user.recoveryContact;

  await user.save();
  return res.status(200).json({ message: "Perfil actualizado correctamente", user });
}
