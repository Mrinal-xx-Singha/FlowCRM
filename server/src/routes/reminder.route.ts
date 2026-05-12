import express from "express";
import { createReminder,getReminders } from "../controllers/reminder.controller";

const router = express.Router()

router.post("/reminders",createReminder)
router.get("/reminders",getReminders)

export default router;