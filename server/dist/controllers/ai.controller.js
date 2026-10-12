"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftEmailHandler = void 0;
const dbConnect_1 = require("../db/dbConnect");
const ai_service_1 = require("../services/ai.service");
const draftEmailHandler = async (req, res) => {
    const userId = req.user?.id;
    const { customer_id, job_id, tone } = req.body;
    try {
        // Fetch customer details
        const customerRes = await dbConnect_1.pool.query("SELECT name,notes,email FROM customers WHERE id =$1 AND user_id =$2", [customer_id, userId]);
        if (customerRes.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }
        const customer = customerRes.rows[0];
        // Fetch job details if job_id was provided
        let jobTitle;
        let dealValue;
        let jobStatus;
        if (job_id) {
            const jobRes = await dbConnect_1.pool.query("SELECT title,deal_value,status FROM jobs WHERE id=$1 AND user_id =$2", [job_id, userId]);
            if (jobRes.rows.length > 0) {
                jobTitle = jobRes.rows[0].title;
                dealValue = jobRes.rows[0].deal_value;
                jobStatus = jobRes.rows[0].status;
            }
        }
        // Generate draft using Gemini
        const draft = await (0, ai_service_1.generateEmailDraft)({
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
    }
    catch (error) {
        console.error("Error in draftEmailHandler:", error);
        return res.status(500).json({ error: "Failed to generate AI email draft" });
    }
};
exports.draftEmailHandler = draftEmailHandler;
