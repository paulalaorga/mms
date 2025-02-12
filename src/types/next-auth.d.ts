import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      recoveryContact: string;
      surname?: string;
      dni?: string;
      phone?: string;
      contractSigned?: boolean;
      isPatient?: boolean;
      groupProgramPaid?: boolean;
      individualProgram?: boolean;
      nextSessionDate?: string | null;
    };
  }
}
