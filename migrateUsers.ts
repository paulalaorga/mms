import mongoose from "mongoose";
import User from "./src/models/User"; // Asegúrate de que el path sea correcto

const MONGO_URI = "mongodb+srv://admin:CwyFhBjjryHoka5I@cluster0.6bg05.mongodb.net/sample_mflix?retryWrites=true&w=majority";

const migrateUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const result = await User.updateMany({}, {
      $set: {
        surname: "", // Si no tienen apellido, se establece vacío
        dni: "",
        phone: "",
        contractSigned: false,
        recoveryContact: "",
        isPatient: false,
        groupProgramPaid: false,
        individualProgram: false,
        nextSessionDate: null,
        provider: null, // Si no tiene un proveedor, se establece como null
      }
    });

    console.log(`✅ ${result.modifiedCount} usuarios migrados correctamente.`);
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Conexión cerrada.");
  }
};

migrateUsers();
