import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("➡️ API llamada para obtener o actualizar un usuario");
  console.log("➡️ Método de la solicitud:", req.method);
  console.log("➡️ Query Params:", req.query); // Log para ver el ID recibido

  await connectDB();

  let { id } = req.query;

  // Si el ID viene en array, tomar el primer elemento
  if (Array.isArray(id)) {
    id = id[0];
  }

  console.log("🔍 ID recibido antes de validación:", id);

  // Verificar si el ID es válido antes de hacer la consulta
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ ID inválido recibido:", id);
    return res.status(400).json({ error: "ID inválido" });
  }

  const objectId = new mongoose.Types.ObjectId(id);

  if (req.method === "GET") {
    try {
      console.log(`🔎 Buscando usuario con ObjectId: ${objectId}`);

      const user = await User.findById(objectId).select("-password");

      if (!user) {
        console.warn(`⚠️ Usuario con ID ${id} no encontrado.`);
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      console.log("✅ Usuario encontrado:", user);
      return res.status(200).json(user);
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }

  if (req.method === "PUT") {
    try {
      console.log("✏️ Datos recibidos para actualizar:", req.body);

      const {
        name,
        surname,
        dni,
        phone,
        role,
        contractSigned,
        isConfirmed,
        isPatient,
        groupProgramPaid,
        individualProgram,
        nextSessionDate,
        recoveryContact,
      } = req.body;

      interface UpdatedUserData {
        name?: string;
        surname?: string;
        dni?: string;
        phone?: string;
        role?: string;
        contractSigned?: boolean;
        isConfirmed?: boolean;
        isPatient?: boolean;
        groupProgramPaid?: boolean;
        individualProgram?: boolean;
        nextSessionDate?: Date;
        recoveryContact?: string;
      }

      // Filtrar los campos que pueden ser actualizados
      const updatedData: UpdatedUserData = {
        name,
        surname,
        dni,
        phone,
        role,
        contractSigned,
        isConfirmed,
        isPatient,
        groupProgramPaid,
        individualProgram,
        nextSessionDate,
        recoveryContact,
      };

      // Eliminar valores `undefined` o `null` para evitar problemas
      Object.keys(updatedData).forEach(
        (key) =>
          (updatedData as UpdatedUserData)[key as keyof UpdatedUserData] === undefined &&
          delete updatedData[key as keyof UpdatedUserData]
      );

      console.log("📝 Datos finales a actualizar:", updatedData);

      const updatedUser = await User.findByIdAndUpdate(objectId, updatedData, {
        new: true, // Devolver el usuario actualizado
        runValidators: true, // Aplicar validaciones del modelo
      }).select("-password");

      if (!updatedUser) {
        console.warn(`⚠️ No se pudo actualizar el usuario con ID ${id}`);
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      console.log("✅ Usuario actualizado:", updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
