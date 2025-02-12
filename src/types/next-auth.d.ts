import  DefaultUser from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      id: string;
      surname?: string;
      isPatient?: boolean;
      groupProgramPaid?: boolean;
      individualProgram?: boolean;
      nextSessionDate?: Date | null;
      role: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    surname?: string;
    isPatient?: boolean;
    groupProgramPaid?: boolean;
    individualProgram?: boolean;
    nextSessionDate?: Date | null;
    role: string;
  }
}
