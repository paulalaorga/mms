// models/Subscription.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  programType: string;
  programName: string;
  orderId: string;
  paycometId?: string;
  amount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  paymentFrequency: string;
  duration: number;
  nextPaymentDate?: Date;
  lastPaymentDate?: Date;
  isActive: boolean;
  paymentMethod: string;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  programType: { type: String, required: true },
  programName: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  paycometId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  status: { type: String, default: 'PENDING' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  paymentFrequency: { type: String, default: 'monthly' },
  duration: { type: Number, default: 12 }, // Duración en meses o número de pagos
  nextPaymentDate: { type: Date },
  lastPaymentDate: { type: Date },
  isActive: { type: Boolean, default: true },
  paymentMethod: { type: String, default: 'card' }
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);