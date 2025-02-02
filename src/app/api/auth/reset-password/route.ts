import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
<<<<<<< HEAD
import crypto from "crypto";

export async function POST(req: Request) {
  await connectDB();
  const { token, newPassword } = await req.json();

  console.log("📌 Datos recibidos en reset-password:", { token, newPassword });

  const user = await User.findOne({ resetPasswordToken: token });
=======
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
>>>>>>> 08b3d2f0f171c551a6f7080a34ee1e9ee860a8c8

  if (!user) {
    return NextResponse.json({ message: "El token es inválido o ha expirado" }, { status: 400 });
  }

<<<<<<< HEAD
  if (user.resetPasswordExpires < Date.now()) {
    return NextResponse.json({ message: "El token ha expirado" }, { status: 400 });
  }

  // ✅ Encriptar la nueva contraseña usando `crypto`
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, "sha512").toString("hex");

  console.log("🔐 Nueva contraseña encriptada:", hashedPassword);

  user.password = `${newPassword}`;
=======
  user.password = hashPassword(newPassword); // ✅ Guardar correctamente la nueva contraseña
>>>>>>> 08b3d2f0f171c551a6f7080a34ee1e9ee860a8c8
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

<<<<<<< HEAD
  console.log("✅ Contraseña actualizada en MongoDB");

=======
>>>>>>> 08b3d2f0f171c551a6f7080a34ee1e9ee860a8c8
  return NextResponse.json({ message: "Contraseña restablecida con éxito" });
}
