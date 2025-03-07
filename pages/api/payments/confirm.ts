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
    console.log("📩 Datos recibidos en `confirm.ts`:", JSON.stringify(req.body, null, 2));

    const {
      userId,
      userName,
      _id: programId,
      orderId,
      programName,
      paymentStatus,
    } = req.body;
    
    console.log("🔍 Verificación de datos individuales:");
    console.log("  - userId:", userId);
    console.log("  - userName:", userName);
    console.log("  - programId:", programId);
    console.log("  - orderId:", orderId);
    console.log("  - programName:", programName);
    console.log("  - paymentStatus:", paymentStatus);

    if (paymentStatus !== "COMPLETED") {
      return res.status(400).json({ message: "El pago no se ha completado" });
    }
    
    // 🔍 Validación: Si algún campo es `undefined`, mostrar el error exacto
    if (!userId || !userName || !programId || !orderId || !programName) {
      console.error("❌ Faltan datos en la solicitud. Campos recibidos:", JSON.stringify(req.body, null, 2));
    
      if (!userId) console.error("❌ userId está ausente o es `undefined`.");
      if (!userName) console.error("❌ userName está ausente o es `undefined`.");
      if (!programId) console.error("❌ programId está ausente o es `undefined`.");
      if (!orderId) console.error("❌ orderId está ausente o es `undefined`.");
      if (!programName) console.error("❌ programName está ausente o es `undefined`.");
    
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    
    // 🔍 Buscar usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔍 Buscar programa
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(400).json({ message: "Programa no encontrado" });
    }

    // 🔍 Verificar si el usuario ya tiene el programa en `PurchasedProgram`
    const hasProgram = await PurchasedProgram.findOne({ userId, programId });
    if (hasProgram) {
      return res.status(400).json({ message: "El usuario ya tiene este programa" });
    }

    // ✅ Crear la compra
    const purchasedProgram = await PurchasedProgram.create({
      userId,
      userName,
      programId,
      programName,
      groupLevel: program.groupLevel || "Nivel no especificado",
      description: program.description || "Sin descripción",
      sessionsIncluded: program.hasIndividualSessions ? program.individualSessionQuantity : 0,
      purchaseDate: new Date(),
      orderId,
    });

    console.log("🔍 Compra registrada:", purchasedProgram);

    // ✅ Incrementar compras en `Program`
    await Program.findByIdAndUpdate(programId, { $inc: { purchases: 1 } });

    // ✅ Asociar la compra al usuario correctamente
    user.isPatient = true;
    user.groupProgramPaid = true;
    user.purchases.push({
      purchaseId: new mongoose.Types.ObjectId(purchasedProgram._id),
      purchaseType: "PurchasedProgram",
    });

    await user.save();
    console.log("✅ Usuario actualizado con la compra:", user.email);

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
