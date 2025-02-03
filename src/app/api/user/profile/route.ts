import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verificar si es ObjectId
  if (mongoose.Types.ObjectId.isValid(session.user.id)) {
    // Buscar en la base
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json(user);
  } else {
    // El usuario de Google no está en la base local, decide qué retornar
    return NextResponse.json({
      message: "Este usuario proviene de Google y no tiene un _id en la DB",
      userData: {
        email: session.user.email,
        // y cualquier info que devuelva Google
      },
    });
  }
}

