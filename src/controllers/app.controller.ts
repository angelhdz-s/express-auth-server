import type { Request, Response } from "express";
import { Success } from "../utils/result.js";

export const appIndexController = (req: Request, res: Response) => {
	const { user } = req.session;
	res.status(200).json(
		Success({
			code: 200,
			message: "Index",
			data: user,
		}),
	);
};
