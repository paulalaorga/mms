import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    // Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Login con usuario y contraseña (MongoDB)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@correo.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Falta el correo o la contraseña");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        if (!user.password) {
          throw new Error("Usa otro método de inicio de sesión");
        }

        const validPassword = await bcrypt.compare(credentials.password, user.password);
        if (!validPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
  
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.role = dbUser.role;  // Agregar el rol del usuario a la sesión
      }
  
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
