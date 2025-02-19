import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "nodejs", // Evita que NextAuth se ejecute en Edge Runtime
};

// 🔹 Definir y exportar `authOptions`
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔍 Datos en signIn callback:", { user, account, profile });
  
      await connectDB();
      let dbUser = await User.findOne({ email: user.email });
  
      // Si el usuario no existe en la base de datos, crearlo
      if (!dbUser) {
        // Crear usuario en la base de datos si no existe
        dbUser = await User.create({
          email: user.email,
          name: user.name,
          role: "user", // Asignar un rol predeterminado (puedes modificarlo según lo que necesites)
          isConfirmed: true, // Si quieres permitir acceso directo
        });
      }
  
      // Devuelves el usuario para el siguiente paso
      return true;
    },
  
    // JWT callback para asegurar que los datos del usuario se mantengan en el token
    async jwt({ token, user, account }) {
      console.log("🔐 Callback JWT - Token antes:", token);
  
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
    
        if (dbUser) {
          token.id = dbUser._id.toString(); // Asigna el ID de MongoDB correctamente
          token.role = dbUser.role;
        }
      }
    
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
      }
    
      console.log("🔐 Callback JWT - Token después:", token);
      return token;
    },
  
    async session({ session, token }) {
      console.log("🔐 Callback de sesión - Token recibido:", token);
    
      if (token) {
        session.user = {
          id: token.id, // Aquí aseguramos que se pase el ID de MongoDB
          name: token.name ?? session.user.name,
          email: token.email ?? session.user.email,
          picture: token.picture ?? session.user.picture,
          role: token.role ?? "user",
        };
      }
    
      console.log("🔐 Callback de sesión - Sesión enviada al frontend:", session);
      return session;
    },
    
  
    // Redirección personalizada después de iniciar sesión
    async redirect(params: { url: string; baseUrl: string }) {
      if (params.url.startsWith(params.baseUrl)) return params.url;
      if (params.url.includes("/api/auth/signout")) return `${params.baseUrl}/`;
      return `${params.baseUrl}/user`;
    }
  },
  
  pages: { signIn: "/login", error: "/error", signOut: "/" },
};

const authHandler = async (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);

export default authHandler;
