import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.DEFAULT_SMTP_USER, // Correo remitente
      pass: process.env.DEFAULT_SMTP_PASS, // Contraseña de aplicación o clave SMTP
    },
  });

  const confirmationUrl = `${process.env.NEXTAUTH_URL}/api/auth/confirm-email?token=${token}`;

  const mailOptions = {
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirma tu cuenta",
    html: `
      <p>Hola,</p>
      <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${confirmationUrl}" style="background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Confirmar cuenta
      </a>
      <p>Si no solicitaste este registro, puedes ignorar este mensaje.</p>
      <p>Saludos,<br>Equipo de Soporte</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de confirmación enviado a:", email);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};
