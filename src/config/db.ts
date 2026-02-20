import mongoose from "mongoose";
const URI = process.env.MONGO_URI ?? "";

console.log(`URI: ${URI}`);
console.log(``);

export const connectDB = async () => {
	try {
		await mongoose.connect(URI);
		console.log("MongoDB conectado ✅");
	} catch (error) {
		console.error("Error de conexión a MongoDB:", error);
		process.exit(1);
	}
};
