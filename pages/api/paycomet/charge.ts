import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Interfaces de tipos para Paycomet
interface PaycometResponse {
  errorCode: number;
  challengeUrl?: string;
}

interface PaycometRequestData {
  payment: {
    terminal: string;
    order: string;
    methodId: number;
    amount: string;
    currency: string;
    originalIp: string;
    productDescription: string;
    secure: string;
    language: string;
    cardData?: {
      pan: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
    };
    idUser?: string;
    tokenUser?: string;
    subscription?: {
      periodicity: string;
      duration: number;
    };
  };
}

interface PaycometErrorDetail {
  message?: string;
  detail?: unknown;
}

interface PaycometErrorResponse {
  errorCode: number;
  error?: PaycometErrorDetail | string;
}

// Type guard para AxiosError
interface AxiosErrorCustom {
  isAxiosError: boolean;
  response?: {
    status?: number;
    data?: PaycometErrorResponse;
  };
}

function isAxiosError(error: unknown): error is AxiosErrorCustom {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as AxiosErrorCustom).isAxiosError === true
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Tomamos del body la info necesaria:
    const {
      amount,
      order,
      paymentType,
      subscriptionDetails,
      // Para el pago con tarjeta se requiere O cardData O idUser/tokenUser
      cardData,
      idUser,
      tokenUser,
    } = req.body;

    // Validación básica
    if (!amount || !order || !paymentType) {
      console.error("❌ Error: Faltan parámetros obligatorios", {
        amount,
        order,
        paymentType,
      });
      return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    // Configuración de Paycomet (variables de entorno)
    const PAYCOMET_API_KEY = process.env.PAYCOMET_API_KEY;
    const PAYCOMET_TERMINAL = process.env.PAYCOMET_TERMINAL;

    if (!PAYCOMET_API_KEY || !PAYCOMET_TERMINAL) {
      console.error(
        "❌ Error: PAYCOMET_API_KEY o PAYCOMET_TERMINAL no están definidos"
      );
      return res
        .status(500)
        .json({ error: "Configuración de Paycomet incorrecta" });
    }

    // Paycomet espera el monto en céntimos, como string
    const formattedAmount = Math.round(amount * 100).toString();
    // Generamos un orderID si no está presente
    const orderId =
      order !== ""
        ? order
        : `ORDER_${Date.now().toString().slice(-6)}`;

    // IP del cliente (si Next está tras un proxy, X-Forwarded-For)
    const clientIp =
      (req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "127.0.0.1"
      ).toString();

    console.log("📢 Enviando solicitud a PAYCOMET:", {
      amount: formattedAmount,
      order: orderId,
      paymentType,
      clientIp,
    });

    // Construcción del body para /v1/payments
    const requestData: PaycometRequestData = {
      payment: {
        terminal: PAYCOMET_TERMINAL,
        order: orderId,
        methodId: 1, // Tarjeta
        amount: formattedAmount,
        currency: "EUR",
        originalIp: clientIp,
        productDescription: "Pago en nuestra plataforma",
        secure: "1", // Forzar 3DS
        language: "es",
      },
    };

    // Si es suscripción, añadimos los datos
    if (paymentType === "subscription") {
      if (
        !subscriptionDetails ||
        !subscriptionDetails.periodicity ||
        !subscriptionDetails.duration
      ) {
        return res.status(400).json({ error: "Faltan detalles de suscripción" });
      }
      requestData.payment.subscription = {
        periodicity: subscriptionDetails.periodicity,
        duration: subscriptionDetails.duration,
      };
    }

    // Para cobrar con tarjeta (methodId=1) se requiere:
    // 1) Datos de tarjeta  O  2) idUser & tokenUser si ya se tokenizó
    if (cardData) {
      // Datos de la tarjeta en texto plano (solo para entornos PCI o de prueba)
      requestData.payment.cardData = {
        pan: cardData.pan,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
      };
    } else if (idUser && tokenUser) {
      // Uso de tarjeta tokenizada en Paycomet
      requestData.payment.idUser = idUser;
      requestData.payment.tokenUser = tokenUser;
    } else {
      // Si no hay ni cardData ni token => error
      return res.status(400).json({
        error: "No se han proporcionado datos de tarjeta ni token de usuario",
      });
    }

    console.log("🔹 Request a PAYCOMET:", JSON.stringify(requestData, null, 2));

    // Llamada al endpoint de Paycomet para pago directo
    const response = await axios.post<PaycometResponse>(
      "https://rest.paycomet.com/v1/payments",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          "PAYCOMET-API-TOKEN": PAYCOMET_API_KEY,
        },
      }
    );

    console.log("🔄 Respuesta de PAYCOMET:", response.data);

    // Verificamos la respuesta
    if (response.data.errorCode === 0) {
      // Pago correcto
      if (response.data.challengeUrl) {
        // Si hay challengeUrl, significa que 3DS requiere desafío
        return res.status(200).json({ challengeUrl: response.data.challengeUrl });
      } else {
        // Pago exitoso sin challenge
        return res.status(200).json({ message: "Pago realizado correctamente" });
      }
    } else {
      // Paycomet devolvió un error en el cuerpo
      console.error("❌ Error en PAYCOMET:", response.data);
      return res
        .status(500)
        .json({ error: `Error en PAYCOMET: ${response.data.errorCode}` });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      // Error a nivel de request/respuesta Axios
      console.error("❌ Error de Axios:", error.response?.data);
      return res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data });
    } else {
      // Error no controlado
      console.error("❌ Error inesperado:", error);
      return res
        .status(500)
        .json({ error: "Error interno en la verificación de pago" });
    }
  }
}
