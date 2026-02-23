import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { Failure, Success } from "../utils/result.js";
import {
	IS_PRODUCTION,
	SECRET_JWT_KEY,
	TOKEN_KEY,
} from "../config/constants.js";
import { User } from "../models/user.model.js";

export const authLoginController = async (req: Request, res: Response) => {
	const { user } = req.session;
	if (user) return res.status(403).redirect("/");

	if (!req.body || !req.body.username || !req.body.password)
		return res.status(400).json(
			Failure({
				code: 400,
				message:
					"Bad request: missing body {username} and/or {password}",
			}),
		);

	const userData = await User.findOne({
		username: req.body.username.trim().toLowerCase(),
	});
	if (!userData)
		return res.status(400).json(
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
		return res.status(400).json(
			Failure({
				code: 400,
				message: "Wrong username or password",
			}),
		);
	if (!SECRET_JWT_KEY)
		return res.status(500).json(
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

	return res
		.cookie(TOKEN_KEY, token, {
			httpOnly: true,
			secure: IS_PRODUCTION,
			sameSite: true,
		})
		.status(202)
		.json(
			Success({
				code: 202,
				message: "Logged In Successfuly",
				data: {
					username: userData.username,
					email: userData.email,
					name: userData.name,
				},
			}),
		);
};

export const authLogoutController = async (req: Request, res: Response) => {
	const token = req.cookies[TOKEN_KEY];
	if (!token) return res.status(401).redirect("/");

	return res
		.clearCookie(TOKEN_KEY)
		.status(202)
		.json(
			Success({
				code: 202,
				message: "Logout successful",
				data: null,
			}),
		);
};
