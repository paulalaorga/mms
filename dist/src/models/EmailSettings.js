"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var EmailSettingsSchema = new mongoose_1.Schema({
    smtpHost: { type: String, required: true },
    smtpPort: { type: Number, required: true },
    smtpUser: { type: String, required: true },
    smtpPass: { type: String, required: true },
    emailFrom: { type: String, required: true },
});
exports.default = mongoose_1.default.models.EmailSettings || mongoose_1.default.model("EmailSettings", EmailSettingsSchema);
