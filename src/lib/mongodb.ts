import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Falta la variable MONGODB_URI en .env.local");
}

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Usando conexión existente a MongoDB");
      return;
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a la base de datos:", conn.connection.name);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }

};
