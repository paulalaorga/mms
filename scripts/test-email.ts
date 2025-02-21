import { sendConfirmationEmail } from "../utils/email";

const testEmail = async () => {
  console.log("🔍 Probando envío de email...");
  await sendConfirmationEmail("tuemail@ejemplo.com", "test-token-123");
};

testEmail();
