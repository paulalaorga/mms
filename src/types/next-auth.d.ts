import { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string; // Agregamos el campo role
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}