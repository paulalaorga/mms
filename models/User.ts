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
  provider?: string;
  subscription?: Types.ObjectId;
  idUser?: string;
  tokenUser?: string;
  groupLevel?: string; 
  paycometUserId?: string;
  purchases?: {
    purchaseId: Types.ObjectId;
    purchaseType: "PurchasedProgram" | "PurchasedSession" | "PurchasedVoucher";
  }[];
}

const PurchaseSchema = new Schema({
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "purchases.purchaseType",
  },
  purchaseType: {
    type: String,
    required: true,
    enum: ["PurchasedProgram", "PurchasedSession", "PurchasedVoucher"],
  },
});


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
  provider: { type: String },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    default: null,
  },
  idUser: { type: String, default: null },
  tokenUser: { type: String, default: null },
  groupLevel: { type: String, default: "Fundamental" },
  paycometUserId: { type: String, unique: true, sparse: true },
  purchases: {
      type: [PurchaseSchema],
      },
},
    {
  timestamps: true,
}
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
