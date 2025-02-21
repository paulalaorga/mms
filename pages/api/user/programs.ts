import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    // Obtener la sesión del usuario autenticado
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const userLevel = session.user.level || "Fundamental"; // ⚡ Asegurar que el nivel está definido

    if (req.method === "GET") {
      // Filtrar los programas por el nivel del usuario
      const programs = await Program.find({ groupLevel: userLevel });
      return res.status(200).json(programs);
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error en la API de usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
