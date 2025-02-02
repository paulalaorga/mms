import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Falta el correo o la contraseña");
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          if (!user.password) {
            throw new Error("Usa otro método de inicio de sesión");
          }

          if (credentials.password !== user.password) {
            throw new Error("Contraseña incorrecta");
          }


          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error(
            "Error en login:",
            error instanceof Error ? error.message : error
          );
          throw new Error(
            error instanceof Error
              ? error.message
              : "Ocurrió un error desconocido."
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user",
          });
        }

        return true;
      } catch (error) {
        console.error(
          "Error en signIn callback:",
          error instanceof Error ? error.message : error
        );
        return false;
      }
    },

    async session({ session }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role || "user"; // Asegurar que `role` exista
        }

        return session;
      } catch (error) {
        console.error(
          "Error en session callback:",
          error instanceof Error ? error.message : error
        );
        return session;
      }
    },

    async redirect({ baseUrl }) {
      // Obtener la sesión actual
      const session = await fetch(`${baseUrl}/api/auth/session`).then((res) =>
        res.json()
      );

      console.log("Redirigiendo usuario con rol:", session?.user?.role);

      // Redirigir según el rol del usuario
      if (session?.user?.role === "admin") {
        return `${baseUrl}/admin`;
      } else {
        return `${baseUrl}/user`;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
