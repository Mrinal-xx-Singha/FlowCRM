"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_service_1 = require("./src/services/cron.service");
const dbConnect_1 = require("./src/db/dbConnect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function run() {
    try {
        await (0, dbConnect_1.connectDB)();
        console.log("Triggering cron service manually...");
        const result = await (0, cron_service_1.processReminders)();
        console.log("CRON RESULT:", result);
    }
    catch (e) {
        console.error("CRON CRASHED:", e);
    }
    finally {
        process.exit();
    }
}
run();
