import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔍 Método recibido:", req.method);
  
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await connectDB();
    
    const session = await getServerSession(req, res, authOptions);
    console.log("🟢 Sesión obtenida:", session);

    if (!session) {
      return res.status(401).json({ error: "No autorizado" });
    }

    console.log("🔹 Datos recibidos:", req.body);

    const { name, surname, phone, dni, contractSigned, recoveryContact } = req.body;

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, surname, phone, dni, contractSigned, recoveryContact },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("✅ Perfil actualizado:", user);

    return res.status(200).json({ message: "Perfil actualizado", user });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

