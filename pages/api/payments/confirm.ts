import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";
import PurchasedProgram from "@/models/Purchase";
import sendEmail from "@/utils/sendEmail";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await dbConnect();
    console.log("📩 Datos recibidos en `confirm.ts`:", req.body);

    const { userId, programName, _id, userName, orderId, expirationDate } = req.body;
    const programId = _id;

    if (!userId || !programId || !orderId) {
      console.error("❌ Faltan datos en la solicitud:", req.body);
      return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(400).json({ message: "Programa no encontrado" });
    }

    const expiryDate = expirationDate || null;

    // ✅ Crear la compra con `paymentId`
    const purchasedProgram = await PurchasedProgram.create({
      userId,
      userName,
      programId,
      programName,
      groupLevel: program.groupLevel || "Nivel no especificado",
      description: program.description || "Sin descripción",
      sessionsIncluded: program.hasIndividualSessions ? program.individualSessionQuantity : 0,
      purchaseDate: new Date(),
      expiryDate,
      therapistId: program.therapistId || new mongoose.Types.ObjectId(),
      meetLink: program.meetLink || "https://meet.google.com/example",
      orderId,
    });

    console.log("✅ Compra guardada en la base de datos con `paymentId`:", paymentId);

    await Program.findByIdAndUpdate(programId, { $inc: { purchases: 1 } });

    // ✅ Asociar la compra al usuario y actualizar `User.purchases`
    user.isPatient = true;
    user.groupProgramPaid = true;
    user.purchases.push({
      purchaseId: purchasedProgram.purchasedPaymentId, // 🔹 Ahora guardamos `paymentId`
      purchaseType: "PurchasedProgram",
    });

    await user.save();
    console.log("✅ Usuario actualizado con el nuevo programa:", user.email);

    // ✅ Enviar email de confirmación
    await sendEmail({
      to: user.email,
      subject: "Confirmación de compra",
      text: `Has adquirido el programa ${program.programName}. Ya tienes acceso a tus sesiones.`,
    });

    console.log("✅ Email de confirmación enviado a:", user.email);

    return res.status(200).json({
      message: "Compra registrada correctamente",
      user,
      purchasedProgram,
    });

  } catch (error) {
    console.error("❌ Error en la confirmación de pago:", error);
    return res.status(500).json({ message: "Error al procesar la compra" });
  }
}
