import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from "../controllers/reminder.controller";

const router = express.Router();

router.post("/reminders", createReminder);
router.get("/reminders", getReminders);
router.get("/reminders/:id", getReminderById);
router.patch("/reminders/:id", updateReminder);
router.delete("/reminders/:id", deleteReminder);

export default router;
