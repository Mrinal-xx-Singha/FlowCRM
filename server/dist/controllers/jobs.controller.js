"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJob = exports.getJobs = exports.createJob = void 0;
const dbConnect_1 = require("../db/dbConnect");
const createJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { customer_id, title, description, status, due_date } = req.body;
        // Check if customer exists and belongs to this user
        const customerResult = await dbConnect_1.pool.query("SELECT id FROM customers WHERE id=$1 AND user_id=$2", [customer_id, userId]);
        if (customerResult.rows.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const jobQuery = "INSERT INTO jobs (user_id,customer_id,title,description,status,due_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
        const jobValues = [userId, customer_id, title, description || null, status, due_date || null];
        const jobResult = await dbConnect_1.pool.query(jobQuery, jobValues);
        return res.status(201).json({ message: "Job created", job: jobResult.rows[0] });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createJob = createJob;
const getJobs = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        // Zod already validated this query parameter perfectly
        const { status, search } = req.query;
        let jobQuery = `
      SELECT jobs.id, jobs.customer_id, jobs.title, jobs.description,jobs.status,jobs.due_date,jobs.created_at,jobs.updated_at,customers.name AS customer_name 
      FROM jobs JOIN customers ON jobs.customer_id = customers.id WHERE jobs.user_id = $1 
    `;
        const jobValues = [userId];
        if (status) {
            jobQuery += ` AND jobs.status = $2 `;
            jobValues.push(status);
        }
        if (search) {
            jobValues.push(`%${search}`);
            jobQuery += ` AND (jobs.title ILIKE $${jobValues.length} OR customers.name ILIKE $${jobValues.length})`;
        }
        jobQuery += " ORDER BY jobs.created_at DESC";
        const result = await dbConnect_1.pool.query(jobQuery, jobValues);
        return res.status(200).json({ jobs: result.rows });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getJobs = getJobs;
const getJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jobId = Number(req.params.id);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const jobQuery = `
      SELECT jobs.id, jobs.customer_id, jobs.title, jobs.description, jobs.status, jobs.due_date, jobs.created_at, jobs.updated_at, customers.name AS customer_name 
      FROM jobs JOIN customers ON jobs.customer_id = customers.id WHERE jobs.id = $1 AND jobs.user_id = $2
    `;
        const result = await dbConnect_1.pool.query(jobQuery, [jobId, userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ job: result.rows[0] });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getJob = getJob;
const updateJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jobId = Number(req.params.id);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { title, description, status, due_date } = req.body;
        const updates = [];
        const values = [];
        if (title !== undefined) {
            updates.push(`title=$${values.length + 1}`);
            values.push(title);
        }
        if (description !== undefined) {
            updates.push(`description=$${values.length + 1}`);
            values.push(description || null);
        }
        if (status !== undefined) {
            updates.push(`status=$${values.length + 1}`);
            values.push(status);
        }
        if (due_date !== undefined) {
            updates.push(`due_date=$${values.length + 1}`);
            values.push(due_date);
        }
        if (updates.length === 0)
            return res.status(400).json({ message: "No valid field provided" });
        values.push(jobId, userId);
        const jobQuery = `UPDATE jobs SET ${updates.join(", ")} WHERE id=$${values.length - 1} AND user_id =$${values.length} RETURNING *`;
        const result = await dbConnect_1.pool.query(jobQuery, values);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ job: result.rows[0] });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        const jobId = Number(req.params.id);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const result = await dbConnect_1.pool.query("DELETE FROM jobs WHERE id=$1 AND user_id=$2 RETURNING *", [jobId, userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ message: "Job deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteJob = deleteJob;
