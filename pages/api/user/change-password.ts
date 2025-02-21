import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    // ✅ Extraer `newPassword` directamente
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "No puedes establecer una contraseña manualmente en una cuenta de Google.",
      });
    }

    user.password = newPassword; // 🔹 Sin encriptación
    await user.save();

    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al cambiar la contraseña:", error);
    return res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
}
