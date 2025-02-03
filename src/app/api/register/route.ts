import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendConfirmationEmail } from "@/utils/email";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, name } = await req.json();

    console.log("Registrando usuario:", email);

    const cleanedEmail = email.trim().toLowerCase(); // Normalizar email
    const existingUser = !!(await User.findOne({ email: cleanedEmail }));

    console.log("¿Usuario existe?:", existingUser);

    if (existingUser) {
      console.log("Usuario ya registrado");
      return NextResponse.json(
        { message: "Usuario ya registrado" },
        { status: 400 }
      );
    }

    const confirmationToken = uuidv4();
    const newUser = new User({
      name,
      email,
      password,
      confirmationToken,
    });

    console.log("Guardando usuario en la base de datos...");
    await newUser.save();
    console.log("Usuario guardado correctamente");

    console.log("Enviando correo de confirmación...");
    await sendConfirmationEmail(email, confirmationToken);
    console.log("Correo de confirmación enviado");

    return NextResponse.json(
      { message: "Usuario registrado, revisa tu correo" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
