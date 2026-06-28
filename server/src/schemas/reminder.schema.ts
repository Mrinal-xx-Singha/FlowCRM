import {z} from "zod"

const allowedStatuses = ["pending","sent"] as const;

export const reminderIdSchema = z.object({
    params:z.object({
        id:z.coerce.number().positive()
    })
})


export const getRemindersQuerySchema = z.object({
    query:z.object({
        status:z.enum(allowedStatuses).optional(),
        upcoming:z.enum(["true","false"]).optional()
    })
})

export const createReminderSchema = z.object({
    body:z.object({
        customer_id:z.coerce.number().positive("Customer ID is required"),
        job_id:z.coerce.number().positive().optional().or(z.literal("")),
        title:z.string().min(1,"Title is required").trim(),
        notes:z.string().trim().optional().or(z.literal("")),
        status:z.enum(allowedStatuses).optional().default("pending"),
        remind_at:z.string().refine((date)=>{
            const parseDate = Date.parse(date);
            if(Number.isNaN(parseDate))return false
            if(new Date(parseDate) <= new Date()) return false
            return true
        },{
            message:"Reminder time must be a valid date in the future",
        })
    })
})


export const updateReminderSchema = z.object({
    params:z.object({
        id:z.coerce.number().positive()
    }),
    body:z.object({
        title: z.string().min(1,"Title cannot be empty").trim().optional(),
        notes:z.string().trim().optional().or(z.literal("")),
        status:z.enum(allowedStatuses),
        remind_at:z.string().refine((date)=>!Number.isNaN(Date.parse(date)),{
            message:"Invalid date format"
        }).optional()
    })
})