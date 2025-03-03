import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";
import PurchasedProgram from "@/models/Purchase";
import sendEmail from "@/utils/sendEmail";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await dbConnect();
    console.log("📩 Datos recibidos en `confirm.ts`:", req.body);

    const { userId, programName, _id, userName, orderId } = req.body;
    const programId = _id;

    if (!userId || !programId) {
      console.error("❌ Faltan datos en la solicitud:", req.body);
      return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    // Convertir `userId` a ObjectId si es válido
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;
    if (!userObjectId) {
      console.error("❌ No se pudo obtener el ID del usuario:", userId);
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Convertir `programId` a ObjectId si es válido, sino buscarlo por `programId`
    let programObjectId = mongoose.Types.ObjectId.isValid(programId)
      ? new mongoose.Types.ObjectId(programId)
      : null;

    let program = null;

    if (!programObjectId) {
      console.warn("⚠️ `programId` no es un ObjectId, buscando en `Program`:", programId);
      program = await Program.findOne({ programId: programId }); // Buscar por `programId`
      if (!program) {
        console.error("❌ Programa no encontrado:", programId);
        return res.status(400).json({ message: "Programa no encontrado" });
      }
      programObjectId = program._id;
    } else {
      program = await Program.findById(programObjectId);
    }

    console.log("✅ Programa encontrado:", program.programName);

    // Verificar si el usuario ya tiene este programa
    const existingPurchase = await PurchasedProgram.findOne({
      userId,
      programId: programObjectId
    });

    if (existingPurchase) {
      console.log("⚠️ El usuario ya tiene este programa comprado:", existingPurchase);
      return res.status(400).json({ message: "Este programa ya fue comprado" });
    }

    // Verificar si el usuario existe
    const user = await User.findById(userObjectId);
    if (!user) {
      console.error("❌ Usuario no encontrado:", userId);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Definir fecha de expiración si es suscripción
    let expiryDate: Date | null = null;
    if (
      program.paymentOptions?.some((opt) => opt.type === "subscription") &&
      program.subscription?.duration
    ) {
      expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + program.subscription.duration);
    }

    // Crear el registro de compra
    const purchasedProgram = await PurchasedProgram.create({
      purchasedProgramId: uuidv4(),
      userId,
      userName,
      programId: programObjectId,
      programName,
      groupLevel: program.groupLevel || "Nivel no especificado",
      description: program.description || "Sin descripción",
      sessionsIncluded: program.hasIndividualSessions ? program.individualSessionQuantity : 0,
      purchaseDate: new Date(),
      expiryDate,
      therapistId: program.therapistId || new mongoose.Types.ObjectId(),
      whatsAppLink: program.whatsAppLink || "https://wa.me/123456789",
      meetLink: program.meetLink || "https://meet.google.com/example",
      orderId: orderId || `Order-${Date.now()}`
    });

    console.log("✅ Compra guardada en la base de datos:", purchasedProgram);

    // Asociar la compra al usuario y guardarlo
    user.isPatient = true;
    user.groupProgramPaid = true;
    user.programs.push(purchasedProgram._id);
    await user.save();
    console.log("✅ Usuario actualizado con el nuevo programa:", user.email);

    // Enviar email de confirmación
    await sendEmail({
      to: user.email,
      subject: "Confirmación de compra",
      text: `Has adquirido el programa ${program.programName}. Ya tienes acceso a tus sesiones.`
    });

    console.log("✅ Email de confirmación enviado a:", user.email);

    return res.status(200).json({
      message: "Compra registrada correctamente",
      user,
      purchasedProgram
    });
  } catch (error) {
    console.error("❌ Error en la confirmación de pago:", error);
    return res.status(500).json({ message: "Error al procesar la compra" });
  }
}
