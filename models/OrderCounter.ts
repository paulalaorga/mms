import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrderCounter extends Document {
  _id: string;
  seq: number;
}

const OrderCounterSchema = new Schema<IOrderCounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }, // Comienza desde 1000 (puedes cambiarlo)
});

const OrderCounterModel: Model<IOrderCounter> =
  mongoose.models?.OrderCounter || mongoose.model<IOrderCounter>("OrderCounter", OrderCounterSchema);

// 🚨 Aseguramos que este código solo se ejecute en el servidor
if (typeof window === "undefined") {
  mongoose.models.OrderCounter = OrderCounterModel;
}

export default OrderCounterModel;