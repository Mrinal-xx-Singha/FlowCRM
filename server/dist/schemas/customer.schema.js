"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.createCustomerSchema = exports.customerIdSchema = void 0;
const zod_1 = require("zod");
exports.customerIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive("ID must be a positive number"),
    })
});
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").trim(),
        // .optional().or(z.literal("")) allows it to be completely missing or an empty string
        email: zod_1.z.email("Invalid email format").trim().toLowerCase().optional().or(zod_1.z.literal("")),
        phone: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        notes: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
    })
});
exports.updateCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().positive(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").trim().optional(),
        email: zod_1.z.email("Invalid email").trim().optional().or(zod_1.z.literal("")),
        phone: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
        notes: zod_1.z.string().trim().optional().or(zod_1.z.literal(""))
    })
});
