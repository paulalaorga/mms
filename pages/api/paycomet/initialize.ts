// pages/api/paycomet/initialize.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../lib/mongodb.mjs";
import UserModel from "../../../models/User.mjs";
import { paycometService } from "../../../services/paycomet-service";
import { Session } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Validar método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // 2) Conectar a la base de datos
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    return res.status(500).json({
      error: "No se pudo conectar a la base de datos",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }

  // 3) Obtener y validar parámetros
  try {
    // Obtener sesión del usuario - explicitly type it as Session
    const session = await getServerSession(req, res, authOptions) as Session | null;
    
    // Obtener parámetros del body
    const { 
      amount, 
      orderId, 
      programId,
      paymentType,
      subscriptionDetails
    } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        error: "El monto (amount) y la orden (orderId) son obligatorios."
      });
    }

    // Validar usuario si hay sesión
    let userEmail = "invitado@example.com";
    
    // Now TypeScript knows session can be null or a Session with user property
    if (session && session.user && session.user.email) {
      userEmail = session.user.email;
      const user = await UserModel.findOne({ email: userEmail });
      
      if (!user) {
        console.warn(`⚠️ Usuario no encontrado en BD: ${userEmail}`);
        // Decidimos continuar aunque el usuario no exista en BD
      }
    }

    // 4) Inicializar pago con Paycomet
    try {
      // Preparar descripción del producto
      let description = `Pago de ${amount}€`;
      if (programId) {
        description += ` para programa ID: ${programId}`;
      }
      description += ` (${paymentType === "subscription" ? "Suscripción" : "Pago único"})`;

      // Inicializar pago
      const paymentUrl = await paycometService.initializePayment({
        amount,
        orderId,
        userEmail,
        description,
        subscriptionDetails
      });

      // 5) Devolver URL de pago al frontend
      return res.status(200).json({ payment_url: paymentUrl });
    } catch (error) {
      console.error("❌ Error al procesar el pago con Paycomet:", error);
      return res.status(500).json({
        error: "Error al procesar el pago con Paycomet",
        details: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  } catch (error) {
    console.error("❌ Error general en initialize:", error);
    return res.status(500).json({
      error: "Error general en el servidor",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}