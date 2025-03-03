import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PurchasedProgram from "@/models/Purchase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }


  if (req.method === "GET") {
    try {

      if(!PurchasedProgram) {
        throw new Error("❌ Error: No se encontraron programas comprados");
      }

      const user = await User.findById(id)
        .populate({
          path: "programs",
          populate: { path: "programId" },
        })
        .lean();

      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      console.log("🔍 Usuario encontrado", JSON.stringify(user, null,2));

      return res.status(200).json(user);
    } catch (error) {
      console.error("❌ Error en la API de usuarios:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

    if (req.method === "PUT") {
      console.log("📩 Recibiendo actualización de usuario:", req.body);

      const { email, contractSigned, isPatient, ...rest } = req.body;

      // 📌 Validar email
      if (!email || !email.includes("@")) {
        console.error("❌ Error: Email inválido:", email);
        return res.status(400).json({ error: "Email inválido" });
      }

      // 📌 Convertir `contractSigned` a Booleano
      const contractSignedBoolean = contractSigned === "Sí" ? true : false;

      // 📌 Validar `isPatient` (asegurar que sea booleano)
      const isPatientBoolean = Boolean(isPatient);

      // 📌 Intentar actualizar el usuario
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { email, contractSigned: contractSignedBoolean, isPatient: isPatientBoolean, ...rest },
        { new: true }
      );

      if (!updatedUser) {
        console.error("❌ Error: Usuario no encontrado para actualizar");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      console.log("✅ Usuario actualizado correctamente:", updatedUser);
      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ error: "Método no permitido" });
  }
