import axios from "axios";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PurchasedProgram from "@/models/Purchase";
import { NextApiRequest, NextApiResponse } from "next"; // ✅ Importar tipos
import { getServerSession } from "next-auth/next"; // ✅ Importar `getServerSession`
import { authOptions } from "../auth/[...nextauth]"; // ✅ Importar opciones de autenticación

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    console.log("📩 Datos recibidos en el webhook:", JSON.stringify(req.body, null, 2));

    const { Order: orderId, IdUser: paycometUserId } = req.body;

    if (!orderId || !paycometUserId) {
      return res.status(400).json({ error: "Faltan datos en la notificación." });
    }

    console.log(`✅ Pago confirmado para la orden: ${orderId}`);

    await dbConnect();

    // ✅ **Obtener usuario desde la sesión**
    const session = await getServerSession(req, res, authOptions);
    let userId = session?.user?.id || null;

    // ✅ Si la sesión no tiene `userId`, buscarlo en la base de datos
    let user = await User.findOne({ paycometUserId });

    if (!user) {
      console.warn(`⚠️ Usuario con paycometUserId ${paycometUserId} no encontrado. Buscando por userId...`);

      // 🔹 Si la sesión tiene `userId`, buscar en la base de datos
      if (!userId) {
        const purchasedProgram = await PurchasedProgram.findOne({ orderId });

        if (!purchasedProgram) {
          console.error("❌ No se encontró la compra asociada a la orden:", orderId);
          return res.status(400).json({ error: "Compra no encontrada" });
        }

        userId = purchasedProgram.userId;
      }

      // 🔹 Buscar usuario por `userId`
      user = await User.findById(userId);

      if (!user) {
        console.error("❌ Usuario no encontrado en la BD con userId:", userId);
        return res.status(404).json({ error: "Usuario no encontrado. Puede que el pago haya sido procesado antes de registrar el usuario." });
      }

      // ✅ **Actualizar `paycometUserId` en la base de datos**
      user.paycometUserId = paycometUserId;
      await user.save();
      console.log(`✅ Asignado paycometUserId: ${paycometUserId} al usuario ${user.email}`);
    }

    // ✅ Enviar datos a confirm.ts después de la confirmación
    try {
      await axios.post("http://localhost:3000/api/payments/confirm", {
        orderId,
        userId: user._id, // ✅ Ahora usamos `_id`, que es el `ObjectId` real de MongoDB
        paycometUserId, // 🔹 Ahora enviamos también el `paycometUserId`
      });

      console.log("✅ Datos enviados a confirm.ts");
    } catch (error) {
      console.error("❌ Error enviando datos a confirm.ts:", error);
    }

    return res.status(200).json({ message: "Compra confirmada correctamente en el webhook." });

  } catch (error) {
    console.error("❌ Error en webhook.ts:", error);
    return res.status(500).json({ error: "Error en el servidor." });
  }
}
