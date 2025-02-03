import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

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

      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        
          if (!credentials) return null;
          await connectDB();

          const { email, password } = credentials;
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
          }

          return { 
            email: user.email, 
            role: user.role,
            id: user._id.toString(),
            name: user.name

        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      // Conectar a Mongo
      // Buscar si ya existe un usuario con user.email
      let dbUser = await User.findOne({ email: user.email });
      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          role: user.role,
          
        });
      }
      // => dbUser._id es un ObjectId
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
      session.user.id = token?.sub ?? "";
      session.user.role = token?.role as string ?? "";
      return session;
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
