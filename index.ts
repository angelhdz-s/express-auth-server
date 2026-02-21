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

app.post("/login", (_req, res) => {
	res.send("Hello World");
});

app.post("/register", (_req, res) => {
	res.send("Hello World");
});

app.use((_req, res) => {
	res.json({ code: 404, message: "Content not found" });
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
