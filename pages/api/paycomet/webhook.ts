import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";
import PurchasedProgram from "@/models/Purchase";
import Subscription from "@/models/Subscription";
import { paycometService } from "@/services/paycomet-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await connectDB();

    // Verificar firma del webhook
    const signature = req.headers["x-paycomet-signature"] as string;
    if (!signature) {
      console.warn("⚠️ Solicitud sin firma de webhook");
    } else {
      const isValid = paycometService.verifyWebhookSignature(req.body, signature);
      if (!isValid) {
        console.error("❌ Firma de webhook inválida");
        return res.status(403).json({ message: "Firma inválida" });
      }
    }

    const { 
      order: orderId,
      payment_status: status
    } = req.body;

    console.log(`📢 Webhook recibido para orden ${orderId}, status: ${status}`);

    // Buscar la suscripción o intento de pago por el ID de orden
    const subscription = await Subscription.findOne({ orderId });
    
    if (!subscription) {
      console.error(`❌ No se encontró suscripción con orderId: ${orderId}`);
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }

    // Buscar usuario y programa
    const user = await User.findById(subscription.userId);
    const program = await Program.findById(subscription.programId);

    if (!user || !program) {
      console.error(`❌ Usuario o programa no encontrado para orderId: ${orderId}`);
      return res.status(404).json({ message: "Usuario o programa no encontrado" });
    }

    // Actualizar estado de la suscripción
    if (status === "AUTHORIZED" || status === "OK") {
      console.log(`✅ Pago aprobado para la orden ${orderId}`);
      
      // Actualizar estado de la suscripción
      subscription.status = "ACTIVE";
      subscription.isActive = true;
      subscription.lastPaymentDate = new Date();
      
      // Calcular próxima fecha de pago si es suscripción
      if (subscription.paymentFrequency === "monthly") {
        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        subscription.nextPaymentDate = nextPaymentDate;
      }
      
      await subscription.save();
      
      // Crear entrada en PurchasedProgram
      const purchasedProgram = new PurchasedProgram({
        orderId,
        userId: user._id,
        programId: program._id,
        programName: program.programName,
        description: program.description,
        purchaseDate: new Date(),
        expiryDate: subscription.endDate
      });
      
      await purchasedProgram.save();
      
      // Actualizar el usuario
      user.isPatient = true;
      if (!user.purchases) user.purchases = [];
      
      user.purchases.push({
        purchaseId: purchasedProgram._id,
        purchaseType: "PurchasedProgram"
      });
      
      await user.save();
      
      return res.status(200).json({ 
        message: "Pago procesado correctamente",
        status: "success"
      });
    } 
    else if (status === "KO" || status === "ERROR") {
      console.log(`❌ Pago fallido para la orden ${orderId}`);
      
      // Actualizar suscripción como fallida
      subscription.status = "FAILED";
      subscription.isActive = false;
      await subscription.save();
      
      return res.status(200).json({ 
        message: "Pago fallido registrado",
        status: "failed"
      });
    } 
    else {
      console.log(`⚠️ Estado de pago no reconocido: ${status}`);
      return res.status(200).json({ 
        message: "Estado de pago no procesable",
        status: "unknown"
      });
    }
  } catch (error) {
    console.error("❌ Error en el webhook de pago:", error);
    return res.status(500).json({ 
      message: "Error en el servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
}