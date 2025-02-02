import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../utils/hashPassword";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  await connectDB();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const hashedPassword = hashPassword(password);

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "user", // Por defecto, los usuarios nuevos son "user"
    });

    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
