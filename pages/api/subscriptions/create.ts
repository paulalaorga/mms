import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Program from "@/models/Program";
import { Types } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ error: "No autorizado" });
    }

    await connectDB();
    
    const { 
      programId, 
      programName, 
      amount, 
      paymentType, 
      orderId, 
      subscriptionDetails 
    } = req.body;

    // Validar datos
    if (!programId || !programName || !amount || !paymentType || !orderId) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Obtener programa
    const program = await Program.findById(programId);
    
    if (!program) {
      return res.status(404).json({ error: "Programa no encontrado" });
    }

    // Calcular fecha de finalización para suscripciones
    let endDate;
    let duration = 0;
    
    if (paymentType === "subscription" && subscriptionDetails) {
      duration = subscriptionDetails.duration || 12; // Por defecto 12 meses
      
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration);
    } else if (paymentType === "one-time") {
      // Para pagos únicos, establecer duración de 1 año
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      duration = 12;
    }

    // Verificar si ya existe una suscripción con este orderId
    const existingSubscription = await Subscription.findOne({ orderId });
    
    if (existingSubscription) {
      return res.status(200).json({ 
        success: true, 
        message: "Suscripción ya registrada",
        subscription: existingSubscription 
      });
    }

    // Crear suscripción
    const subscription = new Subscription({
      userId: session.user.id || session.user.email,
      programId: new Types.ObjectId(programId),
      programType: program.groupLevel,
      programName,
      orderId,
      amount: Number(amount),
      currency: "EUR",
      status: "PENDING",
      startDate: new Date(),
      endDate,
      paymentFrequency: paymentType === "subscription" 
        ? (subscriptionDetails?.periodicity || "monthly") 
        : "one-time",
      duration,
      isActive: false // Se activará cuando el pago sea confirmado
    });

    await subscription.save();

    return res.status(201).json({ 
      success: true, 
      message: "Suscripción registrada correctamente", 
      subscription 
    });
  } catch (error) {
    console.error("❌ Error al crear suscripción:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Error desconocido"
    });
  }
}