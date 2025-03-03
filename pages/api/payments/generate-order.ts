import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import OrderCounter from "@/models/OrderCounter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await connectDB();

    // 🔹 Generar un número de orden único en MongoDB
    const orderCounter = await OrderCounter.findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const orderId = `Pago-${orderCounter.seq}`;
    console.log("✅ Número de orden generado:", orderId);

    return res.status(200).json({ orderId });
  } catch (error) {
    console.error("❌ Error al generar el número de orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
