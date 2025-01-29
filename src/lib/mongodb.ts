import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Falta la variable MONGODB_URI en .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("📌 Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB", error);
    process.exit(1);
  }
};
