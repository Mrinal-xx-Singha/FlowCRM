import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from "../controllers/reminder.controller";
import { validate } from "../middleware/validate.middleware";
import { createReminderSchema, getRemindersQuerySchema, reminderIdSchema, updateReminderSchema } from "../schemas/reminder.schema";

const router = express.Router();

router.post("/reminders",validate(createReminderSchema), createReminder);
router.get("/reminders",validate(getRemindersQuerySchema), getReminders);
router.get("/reminders/:id",validate(reminderIdSchema) ,getReminderById);
router.patch("/reminders/:id", validate(updateReminderSchema),updateReminder);
router.delete("/reminders/:id", validate(reminderIdSchema),deleteReminder);

export default router;
