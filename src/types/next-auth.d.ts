<<<<<<< HEAD
import { DefaultSession } from "next-auth";
=======
import  DefaultUser from "next-auth";
>>>>>>> ae8c881b015f731fa0157f804124f7e1de6389d1

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
