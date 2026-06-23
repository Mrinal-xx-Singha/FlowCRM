import { processReminders } from "./src/services/cron.service";
import { connectDB } from "./src/db/dbConnect";
import dotenv from "dotenv";

dotenv.config();

async function run() {
    try {
        await connectDB();
        console.log("Triggering cron service manually...");
        const result = await processReminders();
        console.log("CRON RESULT:", result);
    } catch (e) {
        console.error("CRON CRASHED:", e);
    } finally {
        process.exit();
    }
}
run();
