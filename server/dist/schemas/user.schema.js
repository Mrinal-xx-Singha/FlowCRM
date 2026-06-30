"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPasswordSchema = exports.updateUserProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateUserProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").trim(),
        email: zod_1.z.email("Invalid email format").trim().toLowerCase(),
    }),
});
exports.updateUserPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, "Current password is required"),
        newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters").trim(),
    }),
});
