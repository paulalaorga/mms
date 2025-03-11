import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import Program, { IProgram } from "@/models/Program";
import PurchasedProgram, { IPurchasedProgram } from "@/models/Purchase";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.email) {
      console.error("❌ No autorizado: sesión no encontrada.");
      return res.status(401).json({ error: "No autorizado" });
    }

    console.log("📩 Usuario autenticado:", session.user.email);

    // 🔹 Buscar al usuario y poblar `purchases.purchaseId`
    const user: IUser | null = await User.findOne({ email: session.user.email }).populate({
      path: "purchases.purchaseId",
      model: PurchasedProgram,
      populate: { path: "programId", model: Program, select: "name description" },
    });

    if (!user) {
      console.error("❌ Usuario no encontrado en la BD.");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("✅ Usuario encontrado:", user.email);

    // ✅ **Verificar si `purchases` tiene datos**
    if (!user.purchases || user.purchases.length === 0) {
      return res.status(200).json({ purchasedPrograms: [], availablePrograms: [] });
    }

    console.log("🔍 Programas asociados al usuario:", user.purchases);

    // 🔹 Obtener los programas comprados correctamente
    const purchasedPrograms: IPurchasedProgram[] = user.purchases
      .filter(p => p.purchaseType === "PurchasedProgram" && p.purchaseId)
      .map(p => p.purchaseId as unknown as IPurchasedProgram); // ✅ Convertir a `IPurchasedProgram`

    console.log("✅ Programas comprados obtenidos:", purchasedPrograms.length);

    // 🔹 Obtener los IDs de los programas comprados
    const userProgramIds = purchasedPrograms.map(p => p.programId?._id);

    console.log("🔹 IDs de programas comprados:", userProgramIds);

    // 🔹 Determinar el nivel del usuario
    const userLevel = user.groupLevel || "Fundamental";

    // 🔹 Obtener programas disponibles (que el usuario no haya comprado)
    const availablePrograms: IProgram[] = await Program.find({
      groupLevel: userLevel,
      _id: { $nin: userProgramIds },
    });

    console.log("✅ Programas disponibles:", availablePrograms.length);

    return res.status(200).json({
      purchasedPrograms,
      availablePrograms,
    });
  } catch (error) {
    console.error("❌ Error al cargar programas:", error);
    return res.status(500).json({ error: "Error al cargar programas" });
  }
}
