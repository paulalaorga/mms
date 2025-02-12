import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions }  from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({ 
      userData: {
        name: user.name,
        surname: user.surname ?? "", // 🔹 Asegurar que surname esté presente
        dni: user.dni ?? "",
        phone: user.phone ?? "",
        email: user.email,
        role: user.role,
        provider: user.provider ?? "email",
        contractSigned: user.contractSigned ?? false,
        recoveryContact: user.recoveryContact ?? "",
        groupProgramPaid: user.groupProgramPaid ?? false,
        individualProgram: user.individualProgram ?? false,
        isPatient: user.isPatient ?? false,
        isConfirmed: user.isConfirmed ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: "Error al obtener los datos del usuario" });
  }
}
