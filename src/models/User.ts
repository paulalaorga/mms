import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Number, default: null },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
