"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reminder_controller_1 = require("../controllers/reminder.controller");
const router = express_1.default.Router();
router.post("/reminders", reminder_controller_1.createReminder);
router.get("/reminders", reminder_controller_1.getReminders);
router.get("/reminders/:id", reminder_controller_1.getReminderById);
router.patch("/reminders/:id", reminder_controller_1.updateReminder);
router.delete("/reminders/:id", reminder_controller_1.deleteReminder);
exports.default = router;
