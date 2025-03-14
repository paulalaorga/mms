import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/mongodb";
import { paycometService, PaycometSearchResponse } from "@/services/paycomet-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Verificar autenticación
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "No autorizado" });
    }

    await connectDB();

    // Obtener parámetro de orden
    const { order } = req.query;

    if (!order || typeof order !== "string") {
      return res.status(400).json({ error: "Se requiere un ID de orden válido" });
    }

    console.log(`🔍 Verificando estado del pago para orden: ${order}`);

    // Consultar a Paycomet por el estado del pago
    try {
      const paymentInfo: PaycometSearchResponse = await paycometService.getPayments(order);
      
      // Verificar si hay errores en la respuesta
      if (paymentInfo.errorCode !== 0) {
        return res.status(400).json({
          error: "Error al verificar el pago",
          code: paymentInfo.errorCode,
          message: paymentInfo.errorMessage || "Error desconocido"
        });
      }

      // Si hay resultados de operaciones, tomar el primero (debería ser el único para este orderId)
      if (paymentInfo.operations && paymentInfo.operations.length > 0) {
        const payment = paymentInfo.operations[0];
        
        // Devolver información del pago en formato simplificado
        return res.status(200).json({
          payment: {
            orderId: payment.order,
            paycometId: payment.paycometId,
            amount: payment.amountEur,
            state: payment.state,
            stateName: payment.stateName,
            timestamp: payment.timestamp,
            // Añadir otros campos necesarios
          }
        });
      } else {
        return res.status(404).json({ error: "No se encontraron pagos para esta orden" });
      }
    } catch (error) {
      console.error("❌ Error al consultar Paycomet:", error);
      return res.status(500).json({ 
        error: "Error al consultar el estado del pago",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Error desconocido"
    });
  }
}