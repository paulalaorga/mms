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
        token.id = user.id;
        token.role = user.role;
        token.surname = user.surname;
        token.isPatient = user.isPatient;
        token.groupProgramPaid = user.groupProgramPaid;
        token.individualProgram = user.individualProgram;
        token.nextSessionDate = user.nextSessionDate ? user.nextSessionDate.toISOString() : null;
      }
      return token;
    },
  
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub ?? "",
        role: (token.role as string) ?? "",
        surname: (token.surname as string) ?? "",
        isPatient: (token.isPatient as boolean) ?? false,
        groupProgramPaid: (token.groupProgramPaid as boolean) ?? false,
        individualProgram: (token.individualProgram as boolean) ?? false,
        nextSessionDate:
        token.nextSessionDate && typeof token.nextSessionDate === "string"
        ? new Date(token.nextSessionDate)
        : null,
      };
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: { signIn: "/login", error: "/error", signOut: "/index" },
};

// 🔹 Ahora usamos `authOptions` en NextAuth
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export default authHandler;
