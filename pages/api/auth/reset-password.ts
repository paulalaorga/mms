import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token y nueva contraseña son obligatorios" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Verificar si el token sigue siendo válido
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // ✅ Actualizar la contraseña del usuario
    user.password = newPassword; // Asegurar que la encriptación se maneja en el modelo
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error en reset-password API:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
