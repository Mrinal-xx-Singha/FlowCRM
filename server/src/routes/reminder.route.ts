import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
} from "../controllers/reminder.controller";

const router = express.Router();

router.post("/reminders", createReminder);
router.get("/reminders", getReminders);
router.get("/reminders/:id", getReminderById);

export default router;
