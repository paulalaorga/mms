import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.DEFAULT_SMTP_USER;
const EMAIL_PASS = process.env.DEFAULT_SMTP_PASS;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, order, paymentType } = req.body;

  if (!email || !order || !paymentType) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // 🔹 Generar el enlace de pago usando `form.ts`
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, paymentType }),
    });

    const { paymentUrl } = await response.json();
    if (!paymentUrl) throw new Error("No se pudo generar el enlace de pago");

    // 🔹 Configurar nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // 🔹 Configurar el email
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Pago pendiente en nuestra plataforma",
      text: `Haz clic en el siguiente enlace para completar tu pago: ${paymentUrl}`,
    };

    // 🔹 Enviar el email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("❌ Error enviando el pago:", error);
    return res.status(500).json({ error: "No se pudo enviar el email" });
  }
}
