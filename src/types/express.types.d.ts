import type { JwtPayload } from "jsonwebtoken";
import { TOKEN_KEY } from "../config/constants.ts";

declare global {
	namespace Express {
		interface Request {
			session: JwtPayload & {
				user: any;
			};
		}

		interface Request {
			cookies: {
				[TOKEN_KEY]?: string;
			};
		}
	}
}
