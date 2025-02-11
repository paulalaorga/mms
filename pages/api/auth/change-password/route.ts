import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  await connectDB();
  const { email, currentPassword, newPassword } = await req.json();

  console.log("📌 Datos recibidos en change-password:", { email, currentPassword, newPassword });

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  // Extraer salt y hash almacenado
  const [salt, storedHash] = user.password.split(":");
  const currentHash = crypto.pbkdf2Sync(currentPassword, salt, 1000, 64, "sha512").toString("hex");

  // Comparar la contraseña actual
  if (currentHash !== storedHash) {
    return NextResponse.json({ message: "La contraseña actual es incorrecta" }, { status: 401 });
  }

  // Generar nuevo hash
  const newSalt = crypto.randomBytes(16).toString("hex");
  const newHashedPassword = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, "sha512").toString("hex");

  user.password = `${newSalt}:${newHashedPassword}`;
  await user.save();

  console.log("✅ Contraseña cambiada con éxito para", email);

  return NextResponse.json({ message: "Contraseña actualizada con éxito" });
}
