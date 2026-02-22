import jwt from "jsonwebtoken";

import type { NextFunction, Request, Response } from "express";
import { SECRET_JWT_KEY, TOKEN_KEY } from "../config/constants.js";
import { Failure } from "../utils/result.js";

export const tokenSessionMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	req.session = { user: null };
	if (!SECRET_JWT_KEY)
		return res.json(
			Failure({
				code: 500,
				message: "Secret was not found",
			}),
		);
	const token = req.cookies?.[TOKEN_KEY];
	if (token) {
		const data = jwt.verify(token, SECRET_JWT_KEY);
		if (data) req.session.user = data;
	}

	next();
};
