import request from "supertest";
import app from "../app";
import { pool } from "../db/dbConnect";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Auth Routes", () => {
  // Clean up users table before each auth test just in case
  beforeEach(async () => {
    await pool.query("DELETE FROM users");
  });

  describe("POST /auth/register", () => {
    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Test User",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All Fields are required");
    });

    it("should register a new user successfully", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email");
      expect(response.body.email).toBe("test@example.com");
    });

    it("should return 409 if user already exists", async () => {
      // Register first
      await request(app).post("/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      // Try to register again
      const response = await request(app).post("/auth/register").send({
        name: "Test User 2",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Email already exists");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Create a user to test login
      await request(app).post("/auth/register").send({
        name: "Test Login",
        email: "login@example.com",
        password: "password123",
      });
    });

    it("should return 401 with wrong password", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should login successfully and return a token", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("login@example.com");
    });
  });
});
