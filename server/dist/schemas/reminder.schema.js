"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReminderSchema = exports.createReminderSchema = exports.getRemindersQuerySchema = exports.reminderIdSchema = void 0;
const zod_1 = require("zod");
const allowedStatuses = ["pending", "sent"];
exports.reminderIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive()
    })
});
exports.getRemindersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(allowedStatuses).optional(),
        upcoming: zod_1.z.enum(["true", "false"]).optional()
    })
});
exports.createReminderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer_id: zod_1.z.coerce.number().positive("Customer ID is required"),
        job_id: zod_1.z.coerce.number().positive().optional().or(zod_1.z.literal("")),
        title: zod_1.z.string().min(1, "Title is required").trim(),
        notes: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        status: zod_1.z.enum(allowedStatuses).optional().default("pending"),
        remind_at: zod_1.z.string().refine((date) => {
            const parseDate = Date.parse(date);
            if (Number.isNaN(parseDate))
                return false;
            if (new Date(parseDate) <= new Date())
                return false;
            return true;
        }, {
            message: "Reminder time must be a valid date in the future",
        })
    })
});
exports.updateReminderSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive()
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title cannot be empty").trim().optional(),
        notes: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        status: zod_1.z.enum(allowedStatuses),
        remind_at: zod_1.z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
            message: "Invalid date format"
        }).optional()
    })
});
