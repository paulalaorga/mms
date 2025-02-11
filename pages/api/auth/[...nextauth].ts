import NextAuth from "next-auth";
import { NextApiHandler } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Asegurar que NextAuth corre en un entorno Serverless
export const config = {
  runtime: "nodejs", // Evita Edge Runtime
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "tu@correo.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connectDB();
          const user = await User.findOne({ email: credentials?.email });

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Falta el correo o la contraseña");
          }

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          if (!user.isConfirmed) {
            throw new Error("Confirma tu correo para iniciar sesión");
          }

          if (user.password !== credentials?.password) {
            throw new Error("Contraseña incorrecta");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
    callbacks: {
      async signIn({ user }) {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({ email: user.email, role: "user" });
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "";
        return session;
      },
      async redirect({ baseUrl }) {
        try {
          const response = await fetch(`${baseUrl}/api/auth/session`);
          const sessionText = await response.text();
          let session;
          try {
            session = JSON.parse(sessionText);
          } catch (jsonError) {
            console.error("🚨 Error al parsear JSON de /api/auth/session:", jsonError);
            console.error("🔴 Respuesta inesperada:", sessionText);
            return `${baseUrl}/error`;
          }
          if (!session || !session.user) return `${baseUrl}/login`;
          return session.user?.role === "admin" ? `${baseUrl}/admin` : `${baseUrl}/user`;
        } catch (error) {
          console.error("❌ Error en la API:", error);
          return `${baseUrl}/error`;
        }
      },
    },
    pages: { signIn: "/login", error: "/error", signOut: "/index" },
  });

export default authHandler;
