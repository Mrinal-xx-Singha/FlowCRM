"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
dotenv_1.default.config({ path: ".env" });
const { Pool } = pg_1.default;
const isTestEnv = process.env.NODE_ENV === "test";
const connectionString = isTestEnv
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;
if (!connectionString) {
    console.error(`❌ ${isTestEnv ? 'TEST_DATABASE_URL' : 'DATABASE_URL'} is not defined in environment variables`);
    process.exit(1);
}
exports.pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});
const connectDB = async () => {
    let client;
    try {
        client = await exports.pool.connect();
        await client.query("SELECT 1");
        console.log("✅ PostgreSQL connected");
    }
    catch (error) {
        console.error("❌ PostgreSQL connection failed", error);
        if (error && typeof error === "object" && "errors" in error) {
            console.error("Inner errors:", error.errors);
        }
        process.exit(1);
    }
    finally {
        client?.release();
    }
};
exports.connectDB = connectDB;
