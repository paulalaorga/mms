import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PurchasedProgram from "@/models/Purchase"; // Asegúrate de importar el modelo correcto


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    if (req.method === "GET") {
      const user = await User.findById(id).populate("purchases.purchaseId");

      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      return res.status(200).json(user);
    }

    if (req.method === "POST") {
      const { programId, programName, description } = req.body;

      if (!programId || !programName) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      console.log(`➕ Agregando programa ${programId} al usuario ${id}`);

      // Crear la nueva compra
      const newPurchase = await PurchasedProgram.create({
        userId: id,
        programId,
        programName,
        description,
        purchaseDate: new Date(),
      });

      // Actualizar el usuario agregando la nueva compra a `purchases`
      const user = await User.findByIdAndUpdate(
        id,
        { 
          $push: { 
            purchases: { 
              purchaseId: newPurchase._id, 
              purchaseType: "PurchasedProgram" 
            } 
          } 
        },
        { new: true }
      ).populate("purchases.purchaseId");

      return res.status(201).json({ message: "Programa agregado correctamente", user });
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
        {
          email,
          contractSigned: contractSignedBoolean,
          isPatient: isPatientBoolean,
          ...rest,
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error("❌ Error: Usuario no encontrado para actualizar");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      console.log("✅ Usuario actualizado correctamente:", updatedUser);
      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      console.log(`🗑 Eliminando usuario ${id}`);

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        console.error("❌ Error: Usuario no encontrado para eliminar");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      console.log("✅ Usuario eliminado correctamente:", deletedUser);
      return res.status(200).json(deletedUser);
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("❌ Error procesando la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
