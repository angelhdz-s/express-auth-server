import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../index.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { seedUsers } from "../seeds/user.seed.js";

describe("GET /", () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should return code 200", async () => {
		await request(app).get("/").expect(200);
	});
});

describe("POST /login", () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should return code 400 when no body is provided", async () => {
		const res = await request(app).post("/login");
		expect(res.status).toBe(400);
	});

	it("should return code 400 when password is wrong", async () => {
		const res = await request(app).post("/login").send({
			username: "angel",
			password: "12345",
		});
		expect(res.status).toBe(400);
	});

	it("should return code 400 when username not exists", async () => {
		const res = await request(app).post("/login").send({
			username: "angels",
			password: "123456",
		});
		expect(res.status).toBe(400);
	});
});

describe("POST /register", async () => {
	beforeAll(async () => {
		await connectDB();
		await seedUsers();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should return code 400 when no body is provided", async () => {
		await request(app).post("/register").expect(400);
	});

	it("should return code 409 when username and email already exists", async () => {
		await request(app)
			.post("/register")
			.send({
				username: "angel",
				password: "12345",
				email: "angelhdz@gmail.com",
				name: "Username and email exists",
			})
			.expect(409);
	});

	it("should return code 409 when username already exists", async () => {
		await request(app)
			.post("/register")
			.send({
				username: "angel",
				password: "12345",
				email: "emailnotexists@gmail.com",
				name: "Username exists",
			})
			.expect(409);
	});

	it("should return code 409 when email already exists", async () => {
		await request(app)
			.post("/register")
			.send({
				username: "angelNotExists",
				password: "12345",
				email: "angelhdz@gmail.com",
				name: "Email exists",
			})
			.expect(409);
	});
});

describe("GET /logout", async () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should return code 302 when not logged in", async () => {
		await request(app).get("/logout").expect(302);
	});
});

describe("GET /profile", async () => {
	beforeAll(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it("should return code 302 when not logged in", async () => {
		await request(app).get("/profile").expect(302);
	});
});
