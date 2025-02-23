import mongoose, { Schema, Document } from "mongoose";

// Interfaz para cada opción de precio
export interface IPricingOption {
  period: "monthly" | "yearly" | "weekly";
  price: number;
  billingCycles?: number;
}

// Interfaz del programa
export interface IProgram extends Document {
  name: string;
  description: string;
  groupLevel: "Fundamental" | "Avanzado" | "VIP";
  paymentType: "subscription" | "one-time";
  suscriptionDetails?: {
    periodicity: "monthly" | "weekly" | "yearly";
    duration: number;
  };
  pricingOptions?: IPricingOption[];
  paymentOptions: string[];
}

// Esquema para cada opción de precio
const PricingOptionSchema = new Schema<IPricingOption>({
  period: { type: String, enum: ["monthly", "yearly", "weekly"], required: true },
  price: { type: Number, required: true },
  billingCycles: { type: Number },
});

// Esquema principal del programa
const ProgramSchema = new Schema<IProgram>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  groupLevel: { type: String, enum: ["Fundamental", "Avanzado", "VIP"], required: true },
  paymentType: { type: String, enum: ["subscription", "one-time"], required: true },
  suscriptionDetails: {
    periodicity: { type: String, enum: ["monthly", "weekly", "yearly"] },
    duration: { type: Number },
  },
  pricingOptions: { type: [PricingOptionSchema], default: [] },
  paymentOptions: { type: [String], default: [] },
});

// Forzamos la recompilación del modelo si ya existe
if (mongoose.models.Program) {
  delete mongoose.models.Program;
}

export default mongoose.model<IProgram>("Program", ProgramSchema);
