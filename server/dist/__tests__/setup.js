"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnect_1 = require("../db/dbConnect");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const globals_1 = require("@jest/globals");
// Set environment to test before any tests run
process.env.NODE_ENV = "test";
(0, globals_1.beforeAll)(async () => {
    // 1. Read the schema.sql file
    const schemaPath = path_1.default.join(__dirname, "../sql/schema.sql");
    const schemaSql = fs_1.default.readFileSync(schemaPath, "utf8");
    // 2. We need to drop all tables first so we have a completely clean slate
    const dropTablesSql = `
    DROP TABLE IF EXISTS reminders CASCADE;
    DROP TABLE IF EXISTS jobs CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `;
    // 3. Execute the drop, then the schema creation
    await dbConnect_1.pool.query(dropTablesSql);
    await dbConnect_1.pool.query(schemaSql);
});
(0, globals_1.afterAll)(async () => {
    // Disconnect from the pool after all test suites are done so Jest can exit cleanly
    await dbConnect_1.pool.end();
});
