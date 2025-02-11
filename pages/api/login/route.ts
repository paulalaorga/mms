import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sign } from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  await connectDB();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const user = await User.findOne({ email });

  if (!user || !password) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);

  return res.status(200).json({ message: "Inicio de sesión exitoso", role: user.role });
}
