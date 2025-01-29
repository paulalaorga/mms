import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { name, password } = await req.json();
  const updates: Partial<{ name: string; password: string }> = {};


  if (name) updates.name = name;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: updates },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Perfil actualizado correctamente", user: updatedUser });
}
