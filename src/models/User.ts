import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  surname?: string;
  dni?: string;
  phone?: string;
  email: string;
  password: string;
  role: string;
  contractSigned?: boolean;
  recoveryContact?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  createdAt?: Date;
  isConfirmed?: boolean;
  confirmationToken?: string;
  isPatient?: boolean;
  groupProgramPaid?: boolean;
  individualProgram?: boolean;
  nextSessionDate?: string | null;
  provider?: string;
}

const UserSchema = new Schema<IUser>({
  _id:{ type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String }, // ✅ Apellidos
  dni: { type: String }, // ✅ DNI/Pasaporte
  phone: { type: String }, // ✅ Teléfono
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", required: true },
  contractSigned: { type: Boolean, default: false }, // ✅ Contrato firmado
  recoveryContact: { type: String, required: false }, // ✅ Contacto de recuperación
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  isConfirmed: { type: Boolean, default: false },
  confirmationToken: { type: String, default: null },
  isPatient: { type: Boolean, default: false }, // ✅ Verificar si es paciente
  groupProgramPaid: { type: Boolean, default: false }, // ✅ Ha pagado el grupo
  individualProgram: { type: Boolean, default: false }, // ✅ Tiene programa individual
  nextSessionDate: { type: String, default: null }, // ✅ Próxima sesión individual
  provider: { type: String}, // ✅ Proveedor de autenticación
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
