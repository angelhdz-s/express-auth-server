import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../index.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { seedUsers } from "../seeds/user.seed.js";

const agent = request.agent(app);

describe("Registration and Authenticated flow", () => {
	const credentials = {
		username: "newUser",
		password: "123456",
		email: "newuser@email.com",
		name: "New User",
	};

	beforeAll(async () => {
		await connectDB();
		await seedUsers();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should register", async () => {
		await agent.post("/register").send(credentials).expect(201);
	});

	it("should login after registration", async () => {
		const res = await agent
			.post("/login")
			.send({
				username: credentials.username,
				password: credentials.password,
			})
			.expect(202);

		expect(res.headers["set-cookie"]).toBeDefined();
	});

	it("should access to profile when logged in", async () => {
		await agent.get("/profile").expect(200);
	});

	it("should not access to register when logged in", async () => {
		await agent.post("/register").send(credentials).expect(302);
	});

	it("should not access to login when logged in", async () => {
		await agent
			.post("/login")
			.send({
				username: credentials.username,
				password: credentials.password,
			})
			.expect(302);
	});

	it("should logout when logged in", async () => {
		await agent.get("/logout").expect(202);
	});
});
