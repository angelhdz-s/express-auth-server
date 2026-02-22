import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { Failure, Success } from "./utils/result.js";
import { User } from "./models/user.model.js";
import {
	IS_PRODUCTION,
	SALT,
	SECRET_JWT_KEY,
	TOKEN_KEY,
} from "./config/constants.js";
import { validateJsonFormatMiddleware } from "./middlewares/json-format-validation.middleware.js";
import { tokenSessionMiddleware } from "./middlewares/token-session.middleware.js";

const app = express();
const PORT = 3001;

await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Custom middlerares
app.use(validateJsonFormatMiddleware);
app.use(tokenSessionMiddleware);

app.get("/", (req: Request, res: Response) => {
	const { user } = req.session;
	res.json(
		Success({
			code: 200,
			message: "Index",
			data: user,
		}),
	);
});

app.get("/profile", (req: Request, res: Response) => {
	const { user } = req.session;

	if (!user) return res.status(402).redirect("/");

	res.json(
		Success({
			code: 200,
			message: "Profile",
			data: user,
		}),
	);
});

app.post("/login", async (req: Request, res: Response) => {
	const { user } = req.session;
	if (user) return res.status(400).redirect("/");

	if (!req.body || !req.body.username || !req.body.password)
		return res.json(
			Failure({
				code: 403,
				message:
					"Bad request: missing body {username} and/or {password}",
			}),
		);

	const userData = await User.findOne({ username: req.body.username });
	if (!userData)
		return res.json(
			Failure({
				code: 400,
				message: "Wrong username or password",
			}),
		);

	const isPasswordCorrect = bcrypt.compareSync(
		req.body.password,
		userData.password,
	);

	const { username, email, name } = userData;

	if (!isPasswordCorrect)
		return res.json(
			Failure({
				code: 400,
				message: "Wrong username or password",
			}),
		);
	if (!SECRET_JWT_KEY)
		return res.json(
			Failure({
				code: 500,
				message: "Secret was not found",
			}),
		);

	const token = jwt.sign(
		{
			username,
			name,
			email,
		},
		SECRET_JWT_KEY,
		{ expiresIn: "1h" },
	);

	console.log(token);

	return res
		.cookie(TOKEN_KEY, token, {
			httpOnly: true,
			secure: IS_PRODUCTION,
			sameSite: true,
		})
		.json(
			Success({
				code: 200,
				message: "Logged In Successfuly",
				data: {
					username: userData.username,
					email: userData.email,
					name: userData.name,
				},
			}),
		);
});

app.post("/register", async (req: Request, res: Response) => {
	const { user } = req.session;
	if (user) return res.status(400).redirect("/");
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

app.get("/logout", async (req: Request, res: Response) => {
	const token = req.cookies[TOKEN_KEY];
	if (!token) return res.status(400).redirect("/");

	return res.clearCookie(TOKEN_KEY).json(
		Success({
			code: 200,
			message: "Logout successful",
			data: null,
		}),
	);
});

app.use((_req: Request, res: Response) => {
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
