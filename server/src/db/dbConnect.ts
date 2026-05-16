import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: ".env" });

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectDB = async () => {
  let client;

  try {
    client = await pool.connect();
    await client.query("SELECT 1");
    console.log("✅ PostgreSQL connected");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed", error);

    if (error && typeof error === "object" && "errors" in error) {
      console.error("Inner errors:", (error as any).errors);
    }

    process.exit(1);
  } finally {
    client?.release();
  }
};
