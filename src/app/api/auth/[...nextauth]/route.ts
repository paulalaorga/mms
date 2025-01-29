import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí puedes validar credenciales contra una base de datos
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null; // Si las credenciales no coinciden, devuelve null
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página personalizada de inicio de sesión
  },
});

export { handler as GET, handler as POST };

