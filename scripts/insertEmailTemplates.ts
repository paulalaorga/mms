import connectDB from "@/lib/mongodb";
import EmailTemplate from "@/models/EmailTemplate";

async function insertTemplates() {
  await connectDB();

  const templates = [
    {
      type: "forgot-password",
      subject: "Recuperación de contraseña",
      body: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><a href="{resetUrl}">{resetUrl}</a>`,
    },
  ];

  await EmailTemplate.insertMany(templates);
  console.log("📧 Plantillas de email insertadas");
}

insertTemplates().then(() => process.exit());
