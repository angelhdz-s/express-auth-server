import type { Request, Response } from "express";
import { Failure } from "../utils/result.js";

export const notFoundMiddleware = (_req: Request, res: Response) => {
	res.status(404).json(
		Failure({
			code: 404,
			message: "Content not found",
		}),
	);
};
