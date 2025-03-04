import mongoose, { Schema,Types, Document } from "mongoose";


export interface IPaymentOption {
  type: "one-time" | "subscription";
  price: number;
  subscriptionDetails?: {
    duration: number;
    renewalPeriod: "monthly" | "yearly";
  };
}

// Interfaz del programa
export interface IProgram extends Document {
  _id: Types.ObjectId;
  programName: string;
  description: string;
  groupLevel: "Fundamental" | "Avanzado";
  paymentOptions: IPaymentOption[];
  expirationDate?: Date;
  hasIndividualSessions?: boolean;
  individualSessionQuantity?: number;
  individualSession?: Types.ObjectId;
  totalUsers: number;
  activeUsers: number;
  createdAt: Date;
}


// Esquema principal del programa
const ProgramSchema = new Schema<IProgram>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  programName: { type: String, required: true },
  description: { type: String, required: true },
  groupLevel: { type: String, enum: ["Fundamental", "Avanzado"], required: true },
  paymentOptions: {
    required: true,
    default: [],
    type: [
      {
        type: { type: String, enum: ["one-time", "subscription"], required: true },
        price: { type: Number, required: true },
        subscriptionDetails: {
          duration: { type: Number, required: function () { return this.type === "subscription"; } },
          renewalPeriod: { type: String, enum: ["monthly", "yearly"], required: function () { return this.type === "subscription"; } },
        },
      },
],
  },
  expirationDate: { type: Date, default: null },
  hasIndividualSessions: { type: Boolean, default: false },
  individualSessionQuantity: { type: Number, default: 0 },
  individualSession: { type: Schema.Types.ObjectId, ref: "Session", default: null },
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});



export default mongoose.models.Program || mongoose.model<IProgram>("Program", ProgramSchema);
