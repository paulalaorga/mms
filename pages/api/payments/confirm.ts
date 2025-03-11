import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";
import PurchasedProgram from "@/models/Purchase";
import PurchasedSession from "@/models/Purchase";
import PurchasedVoucher from "@/models/Purchase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await dbConnect();
    console.log("📩 Datos recibidos en `confirm.ts`:", JSON.stringify(req.body, null, 2));

    const {
      userId,
      orderId,
      amount,
      currency,
      response,
      authCode,
      signature,
      paymentStatus,
      purchaseType,
      programId,
      programName,
      sessionId,
      sessionName,
      sessionDate,
      meetLink,
      therapistId,
      voucherId,
      voucherName,
      description,
      sessionsQuantity,
    } = req.body;

    // ❌ Verificar si faltan datos
    if (!userId || !orderId || !amount || !currency || !response || !authCode || !signature || !paymentStatus || !purchaseType) {
      return res.status(400).json({ error: "Faltan datos obligatorios en la confirmación de pago" });
    }

    if (paymentStatus !== "success") {
      console.log("❌ El pago no se ha completado:", paymentStatus);
      return res.status(400).json({ error: "El pago no se ha completado." });
    }

    // 🔍 Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ Usuario no encontrado:", userId);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let newPurchase;

    // 🎯 **Caso 1: Compra de un programa**
    if (purchaseType === "PurchasedProgram") {
      const program = await Program.findById(programId);
      if (!program) {
        return res.status(400).json({ message: "Programa no encontrado" });
      }

      newPurchase = await PurchasedProgram.create({
        orderId,
        userId,
        programId,
        programName,
        description: program.description || "Sin descripción",
        groupLevel: program.groupLevel || "Nivel no especificado",
        purchaseDate: new Date(),
        expiryDate: null, // 🔹 Puede ser null o definir caducidad
      });

      console.log("✅ Programa comprado:", newPurchase);
    }

    // 🎯 **Caso 2: Compra de una sesión individual**
    else if (purchaseType === "session") {
      if (!sessionId || !sessionName || !sessionDate || !therapistId || !meetLink) {
        return res.status(400).json({ error: "Faltan datos para la sesión individual" });
      }

      newPurchase = await PurchasedSession.create({
        purchasePaymentId: orderId,
        userId,
        sessionId,
        sessionName,
        sessionDate,
        meetLink,
        therapistId,
      });

      console.log("✅ Sesión individual comprada:", newPurchase);
    }

    // 🎯 **Caso 3: Compra de un voucher (bono de sesiones)**
    else if (purchaseType === "voucher") {
      if (!voucherId || !voucherName || !description || !therapistId || !sessionsQuantity) {
        return res.status(400).json({ error: "Faltan datos para el voucher" });
      }

      newPurchase = await PurchasedVoucher.create({
        purchasePaymentId: orderId,
        userId,
        voucherId,
        voucherName,
        description,
        purchaseDate: new Date(),
        meetLink,
        therapistId,
        sessionsQuantity,
        sessionsUsed: 0,
        sessionsRemaining: sessionsQuantity,
      });

      console.log("✅ Voucher comprado:", newPurchase);
    }

    // ❌ Si `purchaseType` no es válido
    else {
      return res.status(400).json({ error: "Tipo de compra no válido" });
    }

    // ✅ **Actualizar usuario con la compra**
    user.purchases.push({ purchaseId: newPurchase._id, purchaseType: "PurchasedProgram" }); // 🔹 Guarda el `ObjectId` real
    await user.save();

    console.log("✅ Usuario actualizado con la compra:", user.email);

    return res.status(200).json({
      message: "Compra registrada correctamente",
      user,
      newPurchase,
    });

  } catch (error) {
    console.error("❌ Error en la confirmación de pago:", error);
    return res.status(500).json({ message: "Error en la confirmación de pago" });
  }
}
