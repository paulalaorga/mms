import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Falta la variable MONGODB_URI en .env.local");
}

// Extender el objeto global para evitar múltiples conexiones en desarrollo
declare global {
  let mongooseConnection: { conn: Connection | null; promise: Promise<Connection> | null };
}

// Usamos una variable global para evitar múltiples conexiones a MongoDB en desarrollo
const globalWithMongoose = global as typeof global & { mongooseConnection?: { conn: Connection | null; promise: Promise<Connection> | null } };

if (!globalWithMongoose.mongooseConnection) {
  globalWithMongoose.mongooseConnection = { conn: null, promise: null };
}

const cached = globalWithMongoose.mongooseConnection;

export default async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    console.log("⚡ Usando conexión existente a MongoDB");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      console.log("✅ Conectado a la base de datos:", mongooseInstance.connection.name);
      return mongooseInstance.connection;
    }).catch((error) => {
      console.error("❌ Error conectando a MongoDB:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
