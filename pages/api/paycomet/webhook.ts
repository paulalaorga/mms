import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Program from "@/models/Program";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await dbConnect();

    const { orderId, userId, programId, status } = req.body;

    if (status !== "success") {
      console.log(`❌ Pago fallido para la orden ${orderId}`);
      return res.status(400).json({ message: "Pago no aprobado" });
    }

    console.log(`✅ Pago aprobado para la orden ${orderId}`);

    // 📌 Verificar que el programa comprado existe
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    // 📌 Registrar la compra en el usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { programs: { programId: program._id, startDate: new Date() } },
        $set: { isPatient: true, groupProgramPaid: true },
      },
      { new: true }
    ).populate("programs.programId");

    return res.status(200).json({ message: "Compra registrada correctamente", user: updatedUser });
  } catch (error) {
    console.error("❌ Error en el webhook de pago:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
