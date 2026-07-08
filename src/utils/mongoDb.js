import { connect, connection } from "mongoose";

const mongoDbPass = process.env.MONGODB_URI;

let cachedConnection = null;

/**
 * Conexión reutilizable con pooling de conexiones optimizado para producción
 * - maxPoolSize: 10 conexiones simultáneas
 * - maxIdleTimeMS: 30s antes de cerrar conexión inactiva
 * - serverSelectionTimeoutMS: 5s timeout para conectar
 */
export async function dbConnect() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const db = await connect(mongoDbPass, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = db;
    return db;
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    throw error;
  }
}

connection.on("connected", () => { console.log("✓ MongoDB Connected") });
connection.on("error", (err) => { console.log(`✗ MongoDB ERROR: ${err.message}`) });
connection.on("disconnected", () => { 
  console.log("⚠ MongoDB Disconnected");
  cachedConnection = null;
});