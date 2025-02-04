import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  createdAt?: Date;
  isConfirmed?: boolean;
  confirmationToken?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  isConfirmed: { type: Boolean, default: false },
  confirmationToken: { type: String, default: null },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
