"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reminder_controller_1 = require("../controllers/reminder.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const reminder_schema_1 = require("../schemas/reminder.schema");
const router = express_1.default.Router();
router.post("/reminders", (0, validate_middleware_1.validate)(reminder_schema_1.createReminderSchema), reminder_controller_1.createReminder);
router.get("/reminders", (0, validate_middleware_1.validate)(reminder_schema_1.getRemindersQuerySchema), reminder_controller_1.getReminders);
router.get("/reminders/:id", (0, validate_middleware_1.validate)(reminder_schema_1.reminderIdSchema), reminder_controller_1.getReminderById);
router.patch("/reminders/:id", (0, validate_middleware_1.validate)(reminder_schema_1.updateReminderSchema), reminder_controller_1.updateReminder);
router.delete("/reminders/:id", (0, validate_middleware_1.validate)(reminder_schema_1.reminderIdSchema), reminder_controller_1.deleteReminder);
exports.default = router;
