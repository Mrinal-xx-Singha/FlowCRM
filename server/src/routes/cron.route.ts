import { Router,Request,Response } from "express";
import { processReminders } from "../services/cron.service";

const router = Router()

router.post("/cron/reminders",async(req:Request,res:Response):Promise<any>=>{
    // Check the secret token in the heades
    const authHeader = req.headers.authorization
    const expectedSecret = process.env.CRON_SECRET;


    if(!expectedSecret){
        console.error("CRON_SECRET is not configured in environment variable")
        return res.status(500).json({error:"Server configuration error"})
    }

    if(authHeader !== `Bearer ${expectedSecret}`){
        return res.status(401).json({error:"Unauthorized"})
    }
    // if authorized run the job
    try{
        const result = await processReminders()
        return res.status(200).json(result)

    }catch(error){
        return res.status(500).json({error:"Internal server error during cron execution"})
    }

})

export default router