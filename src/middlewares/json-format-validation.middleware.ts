import type { NextFunction, Request, Response } from "express";
import { Failure } from "../utils/result.js";

export const validateJsonFormatMiddleware = (
	err: Error,
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof SyntaxError && "body" in err) {
		return res.status(400).json(
			Failure({
				code: 400,
				message: "Invalid JSON format",
			}),
		);
	}
	next();
};
