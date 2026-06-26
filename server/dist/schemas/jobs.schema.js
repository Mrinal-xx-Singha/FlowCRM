"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = exports.getJobQuerySchema = exports.jobIdSchema = void 0;
const zod_1 = require("zod");
const allowStatuses = ["pending", "in_progress", "completed"];
exports.jobIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive()
    })
});
exports.getJobQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(allowStatuses).optional()
    })
});
exports.createJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer_id: zod_1.z.coerce.number().positive("Valid customer ID is required"),
        title: zod_1.z.string().min(1, "Title is required").trim(),
        description: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        status: zod_1.z.enum(allowStatuses).optional().default("pending"),
        due_date: zod_1.z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional(),
    })
});
exports.updateJobSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive(),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title cannot be empty").trim().optional(),
        description: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        status: zod_1.z.enum(allowStatuses).optional(),
        due_date: zod_1.z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional(),
    })
});
