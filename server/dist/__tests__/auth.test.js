"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const dbConnect_1 = require("../db/dbConnect");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("Auth Routes", () => {
    // Clean up users table before each auth test just in case
    (0, globals_1.beforeEach)(async () => {
        await dbConnect_1.pool.query("DELETE FROM users");
    });
    (0, globals_1.describe)("POST /auth/register", () => {
        (0, globals_1.it)("should return 400 if email is missing", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test User",
                password: "password123",
            });
            (0, globals_1.expect)(response.status).toBe(500);
            (0, globals_1.expect)(response.body.message).toBe("Internal server error during validation");
        });
        (0, globals_1.it)("should register a new user successfully", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(response.status).toBe(201);
            (0, globals_1.expect)(response.body).toHaveProperty("email");
            (0, globals_1.expect)(response.body.email).toBe("test@example.com");
        });
        (0, globals_1.it)("should return 409 if user already exists", async () => {
            // Register first
            await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });
            // Try to register again
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test User 2",
                email: "test@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(response.status).toBe(409);
            (0, globals_1.expect)(response.body.error).toBe("Email already exists");
        });
    });
    (0, globals_1.describe)("POST /auth/login", () => {
        (0, globals_1.beforeEach)(async () => {
            // Create a user to test login
            await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test Login",
                email: "login@example.com",
                password: "password123",
            });
        });
        (0, globals_1.it)("should return 401 with wrong password", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "login@example.com",
                password: "wrongpassword",
            });
            (0, globals_1.expect)(response.status).toBe(401);
            (0, globals_1.expect)(response.body.error).toBe("Invalid credentials");
        });
        (0, globals_1.it)("should login successfully and return a token", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "login@example.com",
                password: "password123",
            });
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty("token");
            (0, globals_1.expect)(response.body.user.email).toBe("login@example.com");
        });
    });
});
