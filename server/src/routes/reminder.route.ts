import express from "express";
import { createReminder } from "../controllers/reminder.controller";

const router = express.Router()

router.post("/reminders",createReminder)

export default router;