import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { Failure, Success } from "../utils/result.js";
import {
	SALT,
} from "../config/constants.js";
import { User } from "../models/user.model.js";

export const userProfileController = (req: Request, res: Response) => {
	const { user } = req.session;

	if (!user) return res.status(401).redirect("/");

	res.status(200).json(
		Success({
			code: 200,
			message: "Profile",
			data: user,
		}),
	);
};

export const userRegisterController = async (req: Request, res: Response) => {
	const { user } = req.session;
	if (user) return res.status(403).redirect("/");
	if (
		!req.body ||
		!req.body.username ||
		!req.body.name ||
		!req.body.email ||
		!req.body.password
	)
		return res.status(400).json(
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
		return res.status(409).json(
			Failure({
				code: 409,
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

	return res.status(201).json(
		Success({
			code: 201,
			message: "User created successfuly",
			data: newUser,
		}),
	);
};
