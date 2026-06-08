import { pool } from "../db/dbConnect";
import fs from "fs";
import path from "path";
import { beforeAll, afterAll } from "@jest/globals";

// Set environment to test before any tests run
process.env.NODE_ENV = "test";

beforeAll(async () => {
  // 1. Read the schema.sql file
  const schemaPath = path.join(__dirname, "../sql/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  // 2. We need to drop all tables first so we have a completely clean slate
  const dropTablesSql = `
    DROP TABLE IF EXISTS reminders CASCADE;
    DROP TABLE IF EXISTS jobs CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `;

  // 3. Execute the drop, then the schema creation
  await pool.query(dropTablesSql);
  await pool.query(schemaSql);
});

afterAll(async () => {
  // Disconnect from the pool after all test suites are done so Jest can exit cleanly
  await pool.end();
});
