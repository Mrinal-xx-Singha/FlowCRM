import { z } from "zod";

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.email("Invalid email format").trim().toLowerCase(),
  }),
});

export const updateUserPasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").trim(),
  }),
});
