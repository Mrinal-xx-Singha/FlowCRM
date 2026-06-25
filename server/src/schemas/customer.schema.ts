import {z} from "zod"

export const customerIdSchema = z.object({
    params:z.object({
        id:z.coerce.number().positive("ID must be a positive number"),
    })
})

export const createCustomerSchema = z.object({
    body:z.object({
        name:z.string().min(1,"Name is required").trim(),
        // .optional().or(z.literal("")) allows it to be completely missing or an empty string
        email:z.email("Invalid email format").trim().toLowerCase().optional().or(z.literal("")),
        phone:z.string().trim().optional().or(z.literal("")),
        notes:z.string().trim().optional().or(z.literal("")),
    })
})

export const updateCustomerSchema = z.object({
    params:z.object({
        id:z.coerce.number().positive(),
    }),
    body:z.object({
        name:z.string().min(1,"Name cannot be empty").trim().optional(),
        email:z.email("Invalid email").trim().optional().or(z.literal("")),
        phone:z.string().trim().optional().or(z.literal("")),
        notes:z.string().trim().optional().or(z.literal(""))
    })
})