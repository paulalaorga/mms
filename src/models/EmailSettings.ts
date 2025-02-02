import mongoose, { Schema, Document } from "mongoose";

export interface IEmailSettings extends Document {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
}

const EmailSettingsSchema = new Schema<IEmailSettings>({
  smtpHost: { type: String, required: true },
  smtpPort: { type: Number, required: true },
  smtpUser: { type: String, required: true },
  smtpPass: { type: String, required: true },
  emailFrom: { type: String, required: true },
});

export default mongoose.models.EmailSettings || mongoose.model<IEmailSettings>("EmailSettings", EmailSettingsSchema);
