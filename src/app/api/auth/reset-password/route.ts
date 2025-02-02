import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/utils/hashPassword";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  console.log("📌 Datos recibidos en reset-password:", body);

  const { token, newPassword } = body; // ✅ Ahora coincide con la estructura de la petición

  if (!token || !newPassword) {
    console.error("❌ Error: Faltan datos");
    return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ message: "El token es inválido o ha expirado" }, { status: 400 });
  }

  user.password = hashPassword(newPassword); // ✅ Guardar correctamente la nueva contraseña
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return NextResponse.json({ message: "Contraseña restablecida con éxito" });
}
