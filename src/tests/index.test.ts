import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../index.js";

describe("GET /", () => {
	it("should return code 200", async () => {
		const res = await request(app).get("/");

		expect(res.status).toBe(200);
	});
});

describe("POST /login", () => {
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
