import "dotenv/config";
import express from "express";
import cors from "express";
import cookieParser from "cookie-parser";
import { validateJsonFormatMiddleware } from "./middlewares/json-format-validation.middleware.js";
import { tokenSessionMiddleware } from "./middlewares/token-session.middleware.js";
import {
	userProfileController,
	userRegisterController,
} from "./controllers/user.controller.js";
import { appIndexController } from "./controllers/app.controller.js";
import {
	authLoginController,
	authLogoutController,
} from "./controllers/auth.controller.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Custom middlerares
app.use(validateJsonFormatMiddleware);
app.use(tokenSessionMiddleware);

// Endpoints
app.get("/", appIndexController);
app.get("/profile", userProfileController);
app.post("/register", userRegisterController);
app.post("/login", authLoginController);
app.get("/logout", authLogoutController);

// Not found middleware
app.use(notFoundMiddleware);

// Export app with all endpoints/middlewares
export { app };
