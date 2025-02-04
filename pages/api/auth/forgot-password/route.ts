import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  console.log("📌 Email recibido en forgot-password:", email);

  if (!email) {
    return NextResponse.json({ message: "El email es obligatorio" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "No existe una cuenta con este email" }, { status: 404 });
  }

  // 🔹 Generar un token y guardarlo en la base de datos
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

  console.log("📌 Token antes de guardar en MongoDB:", {
    token: user.resetPasswordToken,
    expires: user.resetPasswordExpires,
  });

  await user.save();

  console.log("✅ Token guardado en MongoDB:", {
    token: user.resetPasswordToken,
    expires: user.resetPasswordExpires,
  });

  // 🔹 Configurar transporte de `nodemailer`
  const transporter = nodemailer.createTransport({
    host: process.env.DEFAULT_SMTP_HOST,
    port: parseInt(process.env.DEFAULT_SMTP_PORT || "587"),
    secure: process.env.DEFAULT_SMTP_PORT === "465",
    auth: {
      user: process.env.DEFAULT_SMTP_USER,
      pass: process.env.DEFAULT_SMTP_PASS,
    },
  });

  // 🔹 Enlace de recuperación de contraseña
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  // 🔹 Opciones del correo
  const mailOptions = {
    from: `"Soporte" <${process.env.DEFAULT_EMAIL_FROM}>`,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetUrl}`,
    html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado con éxito a:", email);
    return NextResponse.json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return NextResponse.json({ message: "Error enviando el email", error: (error as Error).message }, { status: 500 });
  }
}
