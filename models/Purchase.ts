import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPurchasedProgram extends Document {
  orderId: string;
  userId: Types.ObjectId;
  purchasedProgramId: string;
  programId: Types.ObjectId; // ✅ Vinculamos con `Program`
  programName: string; // ✅ Nombre del programa
  groupLevel: string; // ✅ Nivel del programa
  description: string; // ✅ Descripción del programa
  purchaseDate: Date;
  expiryDate: Date;
  meetLink: string;
  whatsAppLink: string;
  therapistId: Types.ObjectId;
}

const PurchasedProgramSchema = new Schema<IPurchasedProgram>({
  orderId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  purchasedProgramId: { type: String, required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true }, // ✅ Relación con `Program`
  programName: { type: String, required: true }, // ✅ Nombre del programa
  description: { type: String, required: true }, // ✅ Descripción del programa
  purchaseDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  meetLink: { type: String, required: true },
  whatsAppLink: { type: String, required: true },
  therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true }
});

export default mongoose.models.PurchasedProgram || mongoose.model<IPurchasedProgram>('PurchasedProgram', PurchasedProgramSchema);

export interface IPurchasedSession extends Document {
  userId: Types.ObjectId;
  sessionId: Types.ObjectId; // ✅ Vinculamos con `Session`
  sessionName: string; // ✅ Nombre de la sesión
  sessionDate: Date;
  meetLink: string;
  therapistId: Types.ObjectId;
}

const PurchasedSessionSchema = new Schema<IPurchasedSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true }, // ✅ Relación con `Session`
  sessionName: { type: String, required: true }, // ✅ Nombre de la sesión
  sessionDate: { type: Date, default: Date.now },
  meetLink: { type: String, required: true },
  therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true }
});

export const PurchasedSession = mongoose
  .models.PurchasedSession || mongoose.model<IPurchasedSession>('PurchasedSession', PurchasedSessionSchema);

export interface IPurchasedVoucher extends Document {
  userId: Types.ObjectId;
  voucherId: string; // 
  voucherName: string; // ✅ Nombre del voucher
  description: string; // ✅ Descripción del voucher
  purchaseDate: Date;
  meetLink: string;
  therapistId: Types.ObjectId;
  sessionsQuantity: number;
  sessionsUsed: number;
  sessionsRemaining: number;
}

const PurchasedVoucherSchema = new Schema<IPurchasedVoucher>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  voucherId: { type: String, required: true }, // 
  voucherName: { type: String, required: true }, // ✅ Nombre del voucher
  description: { type: String, required: true }, // ✅ Descripción del voucher
  purchaseDate: { type: Date, default: Date.now },
  meetLink: { type: String, required: true },
  therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
  sessionsQuantity: { type: Number, required: true },
  sessionsUsed: { type: Number, default: 0 },
  sessionsRemaining: { type: Number, required: true }
}, { timestamps: true }
);

export const PurchasedVoucher = mongoose
  .models.PurchasedVoucher || mongoose.model<IPurchasedVoucher>('PurchasedVoucher', PurchasedVoucherSchema);

