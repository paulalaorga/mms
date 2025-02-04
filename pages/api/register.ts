import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { sendConfirmationEmail } from "@/utils/email";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connectDB();
      const { email, password, name } = req.body;

      // Verificar si los campos están vacíos
      if (!email || !password || !name) {
        console.log("Campos faltantes:", { email, password, name });
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      // Limpiar el email
      const cleanedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: cleanedEmail });

      if (existingUser) {
        console.log("Usuario ya registrado:", cleanedEmail);
        return res.status(400).json({ error: "Este usuario ya está registrado." });
      }

      const confirmationToken = uuidv4();

      // Crear un nuevo usuario
      const newUser = new User({
        name,
        email: cleanedEmail,
        password,
        confirmationToken,
      });

      console.log("Guardando nuevo usuario...");
      await newUser.save();

      // Enviar correo de confirmación
      console.log("Enviando correo de confirmación...");
      await sendConfirmationEmail(cleanedEmail, confirmationToken);

      return res.status(201).json({ message: "Usuario registrado, revisa tu correo" });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
