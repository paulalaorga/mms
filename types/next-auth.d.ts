
declare module "next-auth" {
  /**
   * Extends the built-in User type from next-auth
   */
  interface User {
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
    nextSessionDate?: string | Date;
    role: string;
    provider?: string;
    sub?: string;
  } 

  /**
   * Extends the built-in Session type
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      surname?: string;
      isPatient?: boolean;
      groupProgramPaid?: boolean;
      individualProgram?: boolean;
      nextSessionDate?: string | Date | null;
      role: string;
    };
  }
}