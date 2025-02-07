import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
      id?: string;
      name: string;
      surname?: string;
      email: string;
      phone?: string;
      dni?: string;
      contractSigned?: boolean;
      recoveryContact?: string;
      isPatient?: boolean;
      groupProgramPaid?: boolean;
      individualProgram?: boolean;
      nextSessionDate?: string;
      role: string;
      provider?: string;
    } 

  interface Session {
    user: User & DefaultSession["user"];
  }
}