
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { authOptions } from "../auth/[...nextauth]"; // Ajusta la ruta si difiere
import connectDB from "@/lib/mongodb"; // Donde guardaste el helper
import UserModel from "@/models/User";
import Program from "@/models/Program";
import { getServerSession } from "next-auth/next";

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
    // 4) Leemos las props del body
    const { _id, userId, amount, orderId, programName, userName } = req.body;

    const order = orderId;
    if (!userId || !amount || !orderId ) {
      return res.status(400).json({
        error:
          "El monto (amount), la orden (order) y el programa (programId) son obligatorios.",
      });
    }

    console.log("🔹 Datos recibidos en `onepayment.ts`:", req.body);

  

    const program = await Program.findById(_id);
    if (!program) {
      console.log("❌ Programa no encontrado en la base de datos.");
      return res.status(400).json({ error: "El programa no existe." });
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
    const session = await getServerSession(req, res, authOptions);
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
        order, 
        amount: Math.round(amount * 100).toString(), // Convertimos a céntimos
        currency: "EUR",
        secure: 1,
        scoring: "0",
        productDescription: `Pago de ${userEmail}`,
        merchantDescriptor: "",
        userInteraction: 1,
        trxType: "",
        scaException: "",
        urlOk: `${PAYCOMET_URL_OK}?userId=${userId}&programId=${_id}&orderId=${order}&programName=${encodeURIComponent(programName)}&userName=${encodeURIComponent(userName)}`,
        urlKo: PAYCOMET_URL_KO,
        tokenize: 0,
        merchantData: {},
      },
    };

    console.log("🔹 Payload a Paycomet:", payload);
    console.log("📩 Datos recibidos en `onepayment.ts`:", req.body);

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

      const { challengeUrl } = paymentResponse.data;

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
    console.error("❌ Error general en pago único:", error);
    return res.status(500).json({
      error: "Error general en el servidor",
      details: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

