import {z} from "zod";

export const registerSchema = z.object({
    body:z.object({
        name:z.string().min(1,"Name is required").trim(),
        email:z.email("Invalid email format").trim().toLowerCase(),
        password:z.string().min(6,"Password must be at least 6 characters").trim(),

    })
})

export const loginSchema = z.object({
    body:z.object({
      email:z.email("Invalid email format").trim().toLowerCase(),
      password:z.string().min(1,"Password is required").trim(),
      rememberMe:z.boolean().optional()  
    })
})