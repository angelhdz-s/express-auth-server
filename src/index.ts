import "dotenv/config";
import express from "express";
import cors from "express";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import { Failure, Success } from "./utils/result.js";
import { User } from "./models/user.model.js";
import { SALT } from "./config/constants.js";

const app = express();
const PORT = 3001;

await connectDB();

app.use(express.json());
app.use(cors());

app.use((err: any, _req: any, res: any, next: any) => {
	if (err instanceof SyntaxError && "body" in err) {
		return res.status(400).json(
			Failure({
				code: 400,
				message: "Invalid JSON format",
			}),
		);
	}

	next(err);
});

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

app.post("/login", async (req, res) => {
	if (!req.body || !req.body.username || !req.body.password)
		return res.json(
			Failure({
				code: 403,
				message:
					"Bad request: missing body {username} and/or {password}",
			}),
		);

	const user = await User.findOne({ username: req.body.username });
	if (!user)
		return res.json(
			Failure({
				code: 400,
				message: "Wrong username or password",
			}),
		);

	const isPasswordCorrect = bcrypt.compareSync(
		req.body.password,
		user.password,
	);

	if (!isPasswordCorrect)
		return res.json(
			Failure({
				code: 400,
				message: "Wrong username or password",
			}),
		);

	res.json(
		Success({
			code: 200,
			message: "Logged In Successfuly",
			data: {
				username: user.username,
				email: user.email,
				name: user.name,
			},
		}),
	);
});

app.post("/register", async (req, res) => {
	if (
		!req.body ||
		!req.body.username ||
		!req.body.name ||
		!req.body.email ||
		!req.body.password
	)
		return res.json(
			Failure({
				code: 400,
				message: "Missing body {name} {username} {email} {password}",
			}),
		);

	const { name, email, password } = req.body;
	const username = req.body.username.trim().toLowerCase();

	const usernameExists = await User.findOne({ username });
	const emailExists = await User.findOne({ email });

	if (usernameExists || emailExists) {
		let message = `Username {${username}} and email {${email}} already exist`;
		if (!emailExists) message = `Username {${username}"} already exists`;
		if (!usernameExists) message = `Email {${email}} already exists`;
		return res.status(400).json(
			Failure({
				code: 400,
				message,
			}),
		);
	}

	const passwordHash = bcrypt.hashSync(password, SALT);

	const newUser = await User.insertOne({
		username,
		name,
		email,
		password: passwordHash,
	});

	return res.status(200).json(
		Success({
			code: 200,
			message: "User created successfuly",
			data: newUser,
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
