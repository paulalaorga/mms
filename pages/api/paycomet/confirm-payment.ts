// pages/api/paycomet/confirm-payment.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Session } from "next-auth";
import connectDB from "../../../lib/mongodb.mjs";
import User from "../../../models/User.mjs";
import Subscription from "../../../models/Subscription";
import PurchasedProgram from "../../../models/Purchase.mjs";
import Program from "../../../models/Program"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await connectDB();
    
    // Explicitly type the session object
    const session = await getServerSession(req, res, authOptions) as Session | null;
    
    if (!session) {
      return res.status(401).json({ error: "No autorizado" });
    }
    
    // Now TypeScript knows that session has a user property
    const { orderId, returnCode, programId } = req.body;
    
    // TypeScript now understands session.user exists and has the properties
    const userId = session.user.id;

    if (!orderId) {
      return res.status(400).json({ error: "Falta el ID de orden" });
    }
    
    // Verificar que el código de retorno indique éxito
    if (returnCode !== "0") {
      return res.status(400).json({ error: "El pago no ha sido exitoso" });
    }
    
    console.log(`✅ Confirmando pago exitoso para orden ${orderId}`);
    
    // Buscar si existe una suscripción para esta orden
    const subscription = await Subscription.findOne({ orderId });
    
    // Caso 1: Existe una suscripción (pago recurrente)
    if (subscription) {
      console.log(`📌 Encontrada suscripción para orden ${orderId}`);
      
      // Actualizar el estado de la suscripción
      subscription.status = "ACTIVE";
      subscription.isActive = true;
      subscription.lastPaymentDate = new Date();
      
      // Calcular la próxima fecha de pago según la frecuencia
      if (subscription.paymentFrequency === "monthly") {
        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        subscription.nextPaymentDate = nextPaymentDate;
      }
      
      await subscription.save();
      
      // Crear una entrada en PurchasedProgram
      const purchasedProgram = new PurchasedProgram({
        orderId,
        userId,
        userEmail: session.user.email,
        programId: subscription.programId,
        programName: subscription.programName,
        description: "Programa adquirido mediante suscripción",
        purchaseDate: new Date()
      });
      
      await purchasedProgram.save();
      
      // Actualizar el usuario
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            purchases: {
              purchaseId: purchasedProgram._id,
              purchaseType: "PurchasedProgram"
            }
          },
          isPatient: true,
          groupProgramPaid: true
        }
      );
      
      return res.status(200).json({ 
        success: true, 
        type: "subscription"
      });
    } 
    // Caso 2: No existe suscripción, es un pago único
    else {
      console.log(`📌 No hay suscripción, procesando como pago único para orden ${orderId}`);
      
      // Buscar el programa relacionado
      let program;
      if (programId) {
        program = await Program.findById(programId);
      } else {
        // Si no se proporcionó un programId, buscar cualquier programa que coincida con el nivel
        // del usuario o usar un programa predeterminado
        program = await Program.findOne({ groupLevel: "Fundamental" });
      }
      
      if (!program) {
        return res.status(404).json({ error: "No se pudo encontrar el programa" });
      }
      
      // Crear una entrada en PurchasedProgram para pago único
      const purchasedProgram = new PurchasedProgram({
        orderId,
        userId,
        userEmail: session.user.email,
        programId: program._id,
        programName: program.programName,
        description: "Programa adquirido mediante pago único",
        purchaseDate: new Date()
      });
      
      await purchasedProgram.save();
      
      // Actualizar el usuario
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            purchases: {
              purchaseId: purchasedProgram._id,
              purchaseType: "PurchasedProgram"
            }
          },
          isPatient: true,
          groupProgramPaid: true
        }
      );
      
      return res.status(200).json({ 
        success: true, 
        type: "one-time"
      });
    }
  } catch (error) {
    console.error("❌ Error al confirmar el pago:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor", 
      details: error instanceof Error ? error.message : "Error desconocido"
    });
  }
}