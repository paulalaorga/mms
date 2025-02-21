import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
});

const EmailTemplate =
  mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);

export default EmailTemplate;
