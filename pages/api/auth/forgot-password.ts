import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  await connectDB();

  try {
    console.log("📌 Cuerpo recibido en la API:", req.body);

    // 🔹 Verificar que `email` está en el body
    if (!req.body || !req.body.email) {
      console.error("❌ Email no recibido en la API");
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    const { email } = req.body;

    console.log("📌 Email recibido en forgot-password:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No existe una cuenta con este email" });
    }

    // 🔹 Generar token de recuperación de contraseña
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

    // 🔹 Verificación de Variables de Entorno
    if (!process.env.DEFAULT_SMTP_HOST || !process.env.DEFAULT_SMTP_USER || !process.env.DEFAULT_SMTP_PASS) {
      console.error("❌ Error: Configuración de SMTP no definida en `.env`");
      return res.status(500).json({ message: "Error de configuración del servidor" });
    }

    const smtpPort = process.env.DEFAULT_SMTP_PORT ? parseInt(process.env.DEFAULT_SMTP_PORT, 10) : 587;

    const transporter = nodemailer.createTransport({
      host: process.env.DEFAULT_SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
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

    // 🔹 Enviar email
    await transporter.sendMail(mailOptions);
    console.log("📧 Correo enviado con éxito a:", email);
    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("❌ Error en forgot-password API:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: (error as Error).message,
    });
  }
}
