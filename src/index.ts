import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import { Failure, Success } from "./utils/result.js";

const app = express();
const PORT = 3001;

await connectDB();

app.use(express.json());

app.get("/", (_req, res) => {
	res.json(
		Success({
			code: 200,
			message: "Index",
			data: null,
		}),
	);
});

app.get("/user", (_req, res) => {
	res.json(
		Success({
			code: 200,
			message: "Index",
			data: null,
		}),
	);
});

app.post("/login", (_req, res) => {
	res.json(
		Success({
			code: 200,
			message: "Index",
			data: null,
		}),
	);
});

app.post("/register", (_req, res) => {
	res.json(
		Success({
			code: 200,
			message: "Index",
			data: null,
		}),
	);
});

app.use((_req, res) => {
	res.json(
		Failure({
			code: 404,
			message: "Content not found",
		}),
	);
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
