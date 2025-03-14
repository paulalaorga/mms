import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { paycometService } from "@/services/paycomet-service";
import axios, { AxiosError, isAxiosError } from "axios";

// Define a type for the Paycomet response
interface PaycometResponse {
  errorCode?: number;
  challengeUrl?: string;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Get user session
    const session = await getServerSession(req, res, authOptions);
    
    // Extract payment parameters
    const { 
      amount, 
      programId,
      programName,
      paymentType,
      subscriptionDetails
    } = req.body;

    // Validate required parameters
    if (!amount) {
      return res.status(400).json({ error: "El monto es obligatorio" });
    }

    // Prepare user email (fallback to a default if not available)
    const userEmail = session?.user?.email || 'invitado@example.com';

    // Generate a unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
      // Initialize payment through Paycomet service
      const paymentInitialization = await paycometService.initializePayment({
        amount,
        orderId,
        userEmail,
        description: programName 
          ? `Compra de ${programName}` 
          : `Pago de ${amount}€ para programa ${programId || 'no especificado'}`,
        subscriptionDetails: paymentType === 'subscription' 
          ? subscriptionDetails 
          : undefined
      });

      // Return payment URL to client
      return res.status(200).json({ 
        payment_url: paymentInitialization.paymentUrl,
        orderId 
      });

    } catch (initError) {
      console.error('❌ Error al inicializar pago:', initError);

      // Detailed error handling
      if (isAxiosError(initError)) {
        const axiosError = initError as AxiosError;
        return res.status(axiosError.response?.status || 500).json({
          error: "Error al procesar el pago",
          details: axiosError.response?.data
        });
      }

      // Generic error response
      return res.status(500).json({ 
        error: "Error interno al procesar el pago",
        details: initError instanceof Error ? initError.message : String(initError)
      });
    }
  } catch (error) {
    console.error('❌ Error general en initialize:', error);
    return res.status(500).json({ 
      error: "Error general en el servidor",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}