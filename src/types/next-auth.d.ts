import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      surname?: string;
      isPatient?: boolean;
      groupProgramPaid?: boolean;
      individualProgram?: boolean;
      nextSessionDate?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
    surname?: string;
    isPatient?: boolean;
    groupProgramPaid?: boolean;
    individualProgram?: boolean;
    nextSessionDate?: string | null;
  }
}
