import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export const authOptions: AuthOptions = {
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

      async authorize (credentials) {
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
      if (session.user?.role === "admin") {
        return `${baseUrl}/admin`;
      } else {
        return `${baseUrl}/user`;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/index",
  },
};

export default NextAuth(authOptions);
