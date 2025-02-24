// pages/api/paycomet/form-initialize.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getServerSession } from "next-auth"; // Ajusta la importación según tu configuración
import { authOptions } from "../auth/[...nextauth]"; // Ajusta la ruta si difiere
import connectDB from "@/lib/mongodb"; // Donde guardaste el helper
import UserModel from "@/models/User";

// Variables de entorno
const PAYCOMET_API_URL = process.env.PAYCOMET_BASE_URL!;
const PAYCOMET_API_TOKEN = process.env.PAYCOMET_API_KEY!;
const TERMINAL = process.env.PAYCOMET_TERMINAL!;
const PAYCOMET_URL_OK = process.env.PAYCOMET_URL_OK!;
const PAYCOMET_URL_KO = process.env.PAYCOMET_URL_KO!;


interface PaycometPaymentResponse {
  errorCode: number;
  challengeUrl?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Conexión a la base de datos
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    return res.status(500).json({
      error: "No se pudo conectar a la base de datos",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }

  // 2) Verificar método
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 3) Obtenemos la sesión de usuario (si usas NextAuth)
    const session = await getServerSession(req, res, authOptions);

    // 4) Leemos las props del body
    const { amount, orderId } = req.body;
    if (!amount || !orderId) {
      return res
        .status(400)
        .json({
          error: "El monto (amount) y la orden (order) son obligatorios.",
        });
    }

    // 5) Validamos nuestras credenciales de Paycomet
    if (!PAYCOMET_API_TOKEN || PAYCOMET_API_TOKEN.length < 20) {
      return res
        .status(500)
        .json({ error: "El API Token de Paycomet no es válido." });
    }

    if (!TERMINAL) {
      return res
        .status(500)
        .json({ error: "El Terminal de Paycomet no es válido." });
    }

    // 6) Buscamos al usuario en la BD (por email)
    const userEmail = session?.user?.email || "email_no_disponible@example.com";
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Usuario no encontrado en la base de datos." });
    }

    // 8) Preparamos el payload de pago conforme a la documentación de Paycomet
    const payload = {
      operationType: 1, // Por ejemplo: 1 para autorización
      language: "es",
      terminal: Number(TERMINAL),
      payment: {
        terminal: Number(TERMINAL),
        methods: [], // Según la documentación se espera un array vacío
        excludedMethods: [],
        order: orderId, // Renombramos "orderId" a "order"
        amount: Math.round(amount * 100).toString(), // Convertimos a céntimos
        currency: "EUR",
        secure: 1,
        scoring: "0",
        productDescription: `Pago de ${amount}€ para la orden ${orderId} de ${userEmail}`,
        merchantDescriptor: "",
        userInteraction: 1,
        trxType: "",
        scaException: "",
        urlOk: PAYCOMET_URL_OK,
        urlKo: PAYCOMET_URL_KO,
        tokenize: 0,
        merchantData: {},
      },
    };


    console.log("🔹 Payload a Paycomet:", payload);

    // 9) Llamamos a la API de Paycomet para iniciar el proceso de pago
    try {
      const paymentResponse = await axios.post<PaycometPaymentResponse>(
        `${PAYCOMET_API_URL}/v1/form`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": PAYCOMET_API_TOKEN,
          },
        }
      );

      const { errorCode, challengeUrl } = paymentResponse.data;
      if (errorCode !== 0) {
        throw new Error(`Error Paycomet: ${errorCode}`);
      }

      // 10) Enviamos la URL de challenge (3DS) al frontend
      return res.status(200).json({ payment_url: challengeUrl });
    } catch (error) {
      console.error("❌ Error al procesar el pago con Paycomet:", error);
      return res.status(500).json({
        error: "Error al procesar el pago con Paycomet",
        details: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  } catch (error) {
    console.error("❌ Error general en form-initialize:", error);
    return res.status(500).json({
      error: "Error general en el servidor",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
