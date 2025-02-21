import mongoose, { Schema, Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
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
  // Nuevo campo para relacionar con Subscription (opcional, si ya planeas implementarlo):
  activeSubscription?: Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  surname: { type: String },
  dni: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", required: true },
  contractSigned: { type: Boolean, default: false },
  recoveryContact: { type: String, required: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  isConfirmed: { type: Boolean, default: false },
  confirmationToken: { type: String, default: null },
  isPatient: { type: Boolean, default: false },
  groupProgramPaid: { type: Boolean, default: false },
  individualProgram: { type: Boolean, default: false },
  nextSessionDate: { type: String, default: null },
  provider: { type: String },
  // Campo opcional para un "puntero" a la suscripción principal
  activeSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    default: null,
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
