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
      return res.status(401).json({ error: "No autorizado" });
    }

    // Fetch user with populated purchases, using type assertion for optional chaining
    const user = await User.findOne({ email: session.user.email }).populate({
      path: 'purchases.purchaseId',
      model: PurchasedProgram,
      populate: { 
        path: 'programId', 
        model: Program 
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Safely handle potentially undefined purchases
    const purchases = user.purchases || [];

    // Filter and map valid purchases
    const validPurchases = purchases
      .filter(purchase => 
        purchase.purchaseId && 
        purchase.purchaseType === 'PurchasedProgram' &&
        purchase.purchaseId.programId
      )
      .map(purchase => {
        const program = purchase.purchaseId.programId as IProgram;
        return {
          id: purchase.purchaseId._id,
          programName: program.programName || 'Programa sin nombre',
          description: program.description || 'Sin descripción',
          purchaseDate: purchase.purchaseId.purchaseDate
        };
      });

    // Get IDs of purchased programs
    const purchasedProgramIds = validPurchases.map(p => p.id);

    // Determine user's current group level
    const userLevel = user.groupLevel || "Fundamental";

    // Find available programs not yet purchased
    const availablePrograms = await Program.find({
      groupLevel: { $in: [userLevel, "Fundamental"] },
      _id: { $nin: purchasedProgramIds }
    }).select('programName description groupLevel paymentOptions');

    return res.status(200).json({
      purchasedPrograms: validPurchases,
      availablePrograms
    });

  } catch (error) {
    console.error("❌ Error al cargar programas:", error);
    return res.status(500).json({ 
      error: "Error al cargar programas",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}