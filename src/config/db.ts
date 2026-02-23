import mongoose from "mongoose";
const URI = process.env.MONGO_URI ?? "";

export const connectDB = async () => {
	try {
		await mongoose.connect(URI);
		console.log("MongoDB conectado.");
	} catch (error) {
		console.error("Error de conexión a MongoDB:", error);
		process.exit(1);
	}
};
export const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		console.log("MongoDB desconectado.");
	} catch (error) {
		console.error("Error al desconectar de MongoDB:", error);
	}
};
