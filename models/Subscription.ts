import mongoose, { Types, Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  purchasedProgramId: Types.ObjectId;
  programId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  renewalDate: Date;
  duration?: number;
  status?: "active" | "cancelled";
  cancelledAt?: Date;
  cancelledBy?: Types.ObjectId;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  purchasedProgramId: { type: Schema.Types.ObjectId, ref: 'PurchasedProgram', required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' }, // ID de la suscripción anterior
  renewalDate: { type: Date, required: true }, // Fecha de renovación de la suscripción
  duration: { type: Number }, // Duración de la suscripción en meses
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }, // Estado de la suscripción
  cancelledAt: { type: Date }, // Fecha de cancelación
  cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Usuario que canceló la suscripción
  cancelledReason: { type: String }, // Razón de la cancelación
}, {
  timestamps: true,
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
