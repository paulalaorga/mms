import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "El usuario ya existe" }), { status: 400 });
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  await newUser.save();
  return new Response(JSON.stringify({ message: "Usuario creado correctamente" }), { status: 201 });
}
