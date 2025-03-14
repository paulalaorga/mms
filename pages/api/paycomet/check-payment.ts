// pages/api/paycomet/check-payment.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface PaycometResponse {
  errorCode: number;
  [key: string]: number | string | boolean | null | undefined;
}

// Type guard personalizado para Axios error
interface AxiosErrorResponse {
  response?: {
    status: number;
    data: PaycometResponse;
  };
}

function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return typeof error === 'object' && 
         error !== null && 
         'response' in error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { order } = req.query;

  if (!order || typeof order !== "string") {
    return res.status(400).json({ error: "Se requiere un ID de orden válido" });
  }

  try {
    // Credenciales de Paycomet
    const PAYCOMET_API_TOKEN = process.env.PAYCOMET_API_KEY;
    const PAYCOMET_TERMINAL = process.env.PAYCOMET_TERMINAL;

    if (!PAYCOMET_TERMINAL) {
      throw new Error('PAYCOMET_TERMINAL is not defined');
    }

    const response = await axios.post<PaycometResponse>(
      `${process.env.PAYCOMET_BASE_URL}v1/payments/${order}/info`,
      {
        terminal: parseInt(PAYCOMET_TERMINAL, 10)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "PAYCOMET-API-TOKEN": PAYCOMET_API_TOKEN
        }
      }
    );

    // Comprobar errores en la respuesta de Paycomet
    if (response.data.errorCode !== 0) {
      return res.status(400).json({
        error: "Error en la consulta de Paycomet",
        code: response.data.errorCode
      });
    }

    // Devolver la información de pago
    return res.status(200).json(response.data);
  } catch (error: unknown) {
    console.error("❌ Error consultando el estado del pago:", error);
    
    if (isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        error: "Error en Paycomet",
        details: error.response.data
      });
    }
    
    // Para cualquier otro tipo de error, convertirlo a string seguro
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: errorMessage
    });
  }
}