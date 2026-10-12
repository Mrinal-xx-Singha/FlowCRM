import { Request, Response } from "express";
import { pool } from "../db/dbConnect"
import { generateEmailDraft } from "../services/ai.service";

export const draftEmailHandler = async (req: Request, res: Response) => {
    const userId = req.user?.id
    const { customer_id, job_id, tone } = req.body

    try {
        // Fetch customer details
        const customerRes = await pool.query("SELECT name,notes,email FROM customers WHERE id =$1 AND user_id =$2", [customer_id, userId])
        if (customerRes.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" })


        }
        const customer = customerRes.rows[0]

        // Fetch job details if job_id was provided
        let jobTitle: string | undefined
        let dealValue: number | undefined
        let jobStatus: string | undefined

        if (job_id) {
            const jobRes = await pool.query(
                "SELECT title,deal_value,status FROM jobs WHERE id=$1 AND user_id =$2", [job_id, userId]
            )
            if (jobRes.rows.length > 0) {
                jobTitle = jobRes.rows[0].title
                dealValue = jobRes.rows[0].deal_value;
                jobStatus = jobRes.rows[0].status;
            }
        }
        // Generate draft using Gemini
        const draft = await generateEmailDraft({
            customerName: customer.name,
            customerNotes: customer.notes,
            jobTitle,
            dealValue,
            jobStatus,
            tone,
        });
        return res.status(200).json({
            draft,
            recipient: customer.email,
        });

    } catch (error) {
        console.error("Error in draftEmailHandler:", error);
        return res.status(500).json({ error: "Failed to generate AI email draft" });

    }

}