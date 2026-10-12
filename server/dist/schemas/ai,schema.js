"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftEmailSchema = void 0;
const zod_1 = require("zod");
exports.draftEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer_id: zod_1.z.coerce.number().positive("Customer ID is required"),
        job_id: zod_1.z.coerce.number().positive().optional(),
        tone: zod_1.z.enum(["professional", "friendly", "urgent"]).optional().default("professional"),
    })
});
