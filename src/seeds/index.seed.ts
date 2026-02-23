import { connectDB, disconnectDB } from "../config/db.js";
import { seedUsers } from "./user.seed.js";

await connectDB();

await seedUsers();

await disconnectDB();
