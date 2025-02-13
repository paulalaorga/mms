import NextAuth, { AuthOptions } from "next-auth";
import { NextApiHandler } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Forzar ejecución en Serverless Functions
export const config = {
  runtime: "nodejs", // Evita que NextAuth se ejecute en Edge Runtime
};

// 🔹 Definir y exportar `authOptions`
export const authOptions: AuthOptions = {
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
          name: user.name,
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
        return {
          ...token,
          id: user.id || token.id,
          role: user.role || token.role,
          surname: user.surname || token.surname,
          isPatient: user.isPatient || token.isPatient,
          groupProgramPaid: user.groupProgramPaid || token.groupProgramPaid,
          individualProgram: user.individualProgram || token.individualProgram,
          nextSessionDate: user.nextSessionDate
            ? new Date(user.nextSessionDate).toISOString()
            : token.nextSessionDate,
        };
      }
      return token;
    },
    
    async session({ session, token }) {
      if (!session.user.id || session.user.id !== token.id) {
        session.user = {
          id: token.id ?? session.user.id,
          role: token.role ?? session.user.role,
          surname: token.surname ?? session.user.surname,
          isPatient: token.isPatient ?? session.user.isPatient,
          groupProgramPaid: token.groupProgramPaid ?? session.user.groupProgramPaid,
          individualProgram: token.individualProgram ?? session.user.individualProgram,
          nextSessionDate:
            token.nextSessionDate && typeof token.nextSessionDate === "string"
              ? new Date(token.nextSessionDate)
              : session.user.nextSessionDate ?? null,
        };
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Si el usuario intenta ir a un lugar específico, lo mantenemos
      if (url.startsWith(baseUrl)) return url;
      
      // Si está cerrando sesión, lo mandamos a la página principal
      if (url.includes("/api/auth/signout")) return `${baseUrl}/`;
    
      // Si está iniciando sesión, lo enviamos a una ruta válida (puede ser `/profile` o `/user`)
      return `${baseUrl}/user`;
    },
    
  },
  pages: { signIn: "/login", error: "/error", signOut: "/" },
};

// 🔹 Ahora usamos `authOptions` en NextAuth
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export default authHandler;
