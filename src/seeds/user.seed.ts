import "dotenv/config";
import { connectDB } from "../config/db.ts";
import { User } from "../models/user.ts";
import bcrypt from "bcrypt";

export async function seedUsers() {
	try {
		await connectDB();

		await User.deleteMany();

		await User.insertMany([
			{
				email: "angelhdz@gmail.com",
				name: "Angel Hernandez",
				password: await bcrypt.hash("123456", 10),
				username: "angel",
			},
			{
				email: "sergio@gmail.com",
				password: await bcrypt.hash("123456", 10),
				username: "sergio",
				name: "Sergio Sánchez",
			},
			{
				email: "mario@gmail.com",
				password: await bcrypt.hash("123456", 10),
				username: "mario",
				name: "Mario Vela",
			},
			{
				email: "barras@gmail.com",
				password: await bcrypt.hash("123456", 10),
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
