import { connectDB, pool } from "./src/db/dbConnect";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
    try {
        await connectDB();
        const result = await pool.query("SELECT id, title, status, remind_at, NOW() as current_time FROM reminders;");
        console.log("Database results:", JSON.stringify(result.rows, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
