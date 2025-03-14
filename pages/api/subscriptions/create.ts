// pages/api/subscriptions/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Program from "@/models/Program";

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

    // Calcular fecha de finalización
    let endDate;
    if (paymentType === "subscription" && subscriptionDetails) {
      const { duration } = subscriptionDetails;
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration);
    }

    // Crear suscripción
    const subscription = new Subscription({
      userId: session.user.id,
      programId,
      programType: program.groupLevel,
      programName,
      orderId,
      amount,
      currency: "EUR",
      status: "PENDING",
      startDate: new Date(),
      endDate,
      paymentFrequency: subscriptionDetails?.periodicity || "one-time",
      duration: subscriptionDetails?.duration || 0,
      isActive: false // Se activará cuando el pago sea confirmado
    });

    await subscription.save();

    return res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error("❌ Error al crear suscripción:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}