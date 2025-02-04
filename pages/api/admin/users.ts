import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // Solo permite métodos GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const session = await getSession({ req });
  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}
