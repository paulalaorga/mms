import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb.mjs";
import User from "../../../../models/User.mjs";
import PurchasedProgram from "../../../../models/Purchase.mjs";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { programId } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // 🔹 Verificar si el usuario es administrador
  const adminUser = await User.findOne({ email: session?.user?.email });
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 🔹 Buscar y eliminar el programa de `PurchasedProgram`
    const deletedProgram = await PurchasedProgram.findByIdAndDelete(programId);

    if (!deletedProgram) {
      return res.status(404).json({ error: "Programa no encontrado" });
    }

    // 🔹 Eliminar referencias en todos los usuarios que compraron este programa
    await User.updateMany(
      { programs: programId },
      { $pull: { programs: programId } }
    );

    return res.status(200).json({ message: "Programa eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando el programa:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
