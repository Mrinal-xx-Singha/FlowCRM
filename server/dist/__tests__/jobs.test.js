"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const dbConnect_1 = require("../db/dbConnect");
const bcrypt_1 = __importDefault(require("bcrypt"));
describe("Jobs API Endpoints", () => {
    let authToken;
    // Runs ONCE before these specific tests
    beforeAll(async () => {
        // 1. Create a dummy user in the clean database
        const hashedPassword = await bcrypt_1.default.hash("password123", 10);
        const userRes = await dbConnect_1.pool.query("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id", ["Test User", "testuser@flowcrm.com", hashedPassword]);
        const userId = userRes.rows[0].id;
        // 2. Login to get a JWT token so we can access protected routes
        const loginRes = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: "testuser@flowcrm.com",
            password: "password123",
        });
        authToken = loginRes.body.token;
        // 3. Create a dummy customer to attach jobs to
        await dbConnect_1.pool.query("INSERT INTO customers (id, user_id, name, email) VALUES ($1, $2, $3, $4)", [99, userId, "Test Corp", "contact@testcorp.com"]);
    });
    // ---  TESTS  --- //
    it("should create a new job successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/jobs")
            .set("Authorization", `Bearer ${authToken}`) // Pass the JWT token
            .send({
            customer_id: 99,
            title: "Build Website",
            deal_value: 50000,
            status: "pending",
        });
        // Assert the response status and body
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("job");
        expect(res.body.job.title).toBe("Build Website");
        expect(res.body.job.deal_value).toBe(50000);
    });
    it("should block unauthenticated requests", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/jobs")
            // Notice we are NOT setting the Authorization header here
            .send({
            customer_id: 99,
            title: "Hacked Job",
        });
        expect(res.status).toBe(401);
    });
    it("should fetch a list of jobs for the user", async () => {
        await (0, supertest_1.default)(app_1.default)
            .post("/api/jobs")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
            customer_id: 99,
            title: "SEO Audit",
            deal_value: 15000,
            status: "pending"
        });
        // Make a get request to fetch the users jobs
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/jobs")
            .set("Authorization", `Bearer ${authToken}`);
        // Assert: Verify the server returns a 200ok and an array of jobs
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("jobs");
        // we expect at least 1 job because we just created "SEO Audit" (plus any from previous tests)
        expect(res.body.jobs.length).toBeGreaterThan(0);
        // Verify the data returned from the database includes the customer name (VIA SQL JOIN)
        const seoJob = res.body.jobs.find((j) => j.title === "SEO Audit");
        expect(seoJob).toBeDefined();
        expect(seoJob.customer_name).toBe("Test Corp");
        expect(seoJob.deal_value).toBe(15000);
    });
});
