import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  await connectDB();
  const { token, newPassword } = await req.json();

  console.log("📌 Datos recibidos en reset-password:", { token, newPassword });

  const user = await User.findOne({ resetPasswordToken: token });

  if (!user) {
    return NextResponse.json({ message: "El token es inválido o ha expirado" }, { status: 400 });
  }

  if (user.resetPasswordExpires < Date.now()) {
    return NextResponse.json({ message: "El token ha expirado" }, { status: 400 });
  }

  // ✅ Encriptar la nueva contraseña usando `crypto`
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, "sha512").toString("hex");

  console.log("🔐 Nueva contraseña encriptada:", hashedPassword);

  user.password = `${newPassword}`;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  console.log("✅ Contraseña actualizada en MongoDB");

  return NextResponse.json({ message: "Contraseña restablecida con éxito" });
}
