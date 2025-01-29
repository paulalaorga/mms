import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "credentials" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
