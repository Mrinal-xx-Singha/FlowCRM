import { z } from "zod"

export const draftEmailSchema = z.object({
    body: z.object({
        customer_id: z.coerce.number().positive("Customer ID is required"),
        job_id: z.coerce.number().positive().optional(),
        tone: z.enum(["professional", "friendly", "urgent"]).optional().default("professional"),
    })
})