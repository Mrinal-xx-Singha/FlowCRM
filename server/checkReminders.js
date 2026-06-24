"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnect_1 = require("./src/db/dbConnect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const run = async () => {
    try {
        await (0, dbConnect_1.connectDB)();
        const result = await dbConnect_1.pool.query("SELECT id, title, status, remind_at, NOW() as current_time FROM reminders;");
        console.log("Database results:", JSON.stringify(result.rows, null, 2));
    }
    catch (e) {
        console.error(e);
    }
    finally {
        process.exit(0);
    }
};
run();
