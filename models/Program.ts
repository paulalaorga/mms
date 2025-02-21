import { Schema, model, models } from "mongoose";

const ProgramSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  paymentOptions: { type: [String], default: [] },
});

export default models.Program || model("Program", ProgramSchema);
