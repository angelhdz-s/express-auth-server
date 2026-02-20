import "dotenv/config";
import express from "express";
import { connectDB } from "./src/config/db.ts";

const app = express();
const PORT = 3001;

await connectDB();

app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Hello World");
});

app.get("/user", (_req, res) => {
	res.send("Hello World");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
