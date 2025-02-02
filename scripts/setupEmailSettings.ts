import mongoose from "mongoose";
import "dotenv/config";
import EmailSettings from "../src/models/EmailSettings";

async function setup() {
  console.log("📌 Conectando a MongoDB...");
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "sample_mflix",
  });

  console.log("🔍 Eliminando configuraciones anteriores...");
  await EmailSettings.deleteMany({});

  const emailConfig = {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "tu-correo@gmail.com",
    smtpPass: "tu-contraseña-generada",
    emailFrom: "tu-correo@gmail.com",
  };

  console.log("💾 Intentando guardar configuración SMTP en MongoDB...");
  try {
    await EmailSettings.create(emailConfig);
    console.log("✅ Configuración guardada correctamente.");
  } catch (error) {
    console.error("❌ Error al guardar configuración:", error);
  }

  mongoose.connection.close();
}

setup();
