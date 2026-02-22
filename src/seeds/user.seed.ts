import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { SALT } from "../config/constants.js";

export async function seedUsers() {
	try {
		await connectDB();

		await User.deleteMany();
		console.log("Users deleted");

		await User.insertMany([
			{
				email: "angelhdz@gmail.com",
				name: "Angel Hernandez",
				password: await bcrypt.hash("123456", SALT),
				username: "angel",
			},
			{
				email: "sergio@gmail.com",
				password: await bcrypt.hash("123456", SALT),
				username: "sergio",
				name: "Sergio Sánchez",
			},
			{
				email: "mario@gmail.com",
				password: await bcrypt.hash("123456", SALT),
				username: "mario",
				name: "Mario Vela",
			},
			{
				email: "barras@gmail.com",
				password: await bcrypt.hash("123456", SALT),
				username: "barras",
				name: "Barras",
			},
		]);

		process.exit(1);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

await seedUsers();
