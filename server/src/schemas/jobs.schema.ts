import { z } from "zod"
const allowStatuses = ["pending", "in_progress", "completed"] as const;

export const jobIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().positive()
    })
})


export const getJobQuerySchema = z.object({
    query: z.object({
        status: z.enum(allowStatuses).optional(),
        search:z.string().optional()
    })
})


export const createJobSchema = z.object({
    body: z.object({
        customer_id: z.coerce.number().positive("Valid customer ID is required"),
        title: z.string().min(1, "Title is required").trim(),
        description: z.string().trim().optional().or(z.literal("")),
        status: z.enum(allowStatuses).optional().default("pending"),
        due_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional(),


    })
})

export const updateJobSchema = z.object({
    params: z.object({
        id: z.coerce.number().positive(),
    }),
    body: z.object({
        title: z.string().min(1, "Title cannot be empty").trim().optional(),
        description: z.string().trim().optional().or(z.literal("")),
        status: z.enum(allowStatuses).optional(),
        due_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional(),
    })
})