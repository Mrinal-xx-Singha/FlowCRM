import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { customer_id, title, description, status, due_date } = req.body;
  const customerId = Number(customer_id);
  const jobStatus = status || "pending";
  const allowedStatus = ["pending", "in_progress", "completed"];
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (Number.isNaN(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "Invalid customer id" });
  }

  if (status !== undefined && !allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status type" });
  }
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
  }

  if (due_date !== undefined && Number.isNaN(Date.parse(due_date))) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const trimmedTitle = title.trim();
  const trimmedDescription =
    description !== undefined ? description.trim() : null;
  try {
    const customerQuery = "SELECT id FROM customers WHERE id=$1 AND user_id=$2";
    const customerValues = [customerId, userId];
    const customerResult = await pool.query(customerQuery, customerValues);
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const jobQuery =
      "INSERT INTO jobs (user_id,customer_id,title,description,status,due_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
    const jobValues = [
      userId,
      customerId,
      trimmedTitle,
      trimmedDescription,
      jobStatus,
      due_date,
    ];
    const jobResult = await pool.query(jobQuery, jobValues);

    return res
      .status(201)
      .json({ message: "Job created", job: jobResult.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { status } = req.query;
  const allowedStatus = ["pending", "in_progress", "completed"];
  if (status !== undefined && typeof status !== "string") {
    return res.status(400).json({ message: "Status must be a string" });
  }
  if (status !== undefined && !allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status type" });
  }

  try {
    let jobQuery =
      "SELECT jobs.id, jobs.customer_id, jobs.title, jobs.description,jobs.status,jobs.due_date,jobs.created_at,jobs.updated_at,customers.name AS customer_name FROM jobs JOIN customers ON jobs.customer_id = customers.id WHERE jobs.user_id = $1 ";
    const jobValues: unknown[] = [userId];
    if (status !== undefined) {
      jobQuery += ` AND jobs.status = $2 `;
      jobValues.push(status);
    }
    jobQuery += " ORDER BY jobs.created_at DESC";
    const result = await pool.query(jobQuery, jobValues);

    return res.status(200).json({ jobs: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = Number(req.params.id);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (Number.isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  try {
    const jobQuery =
      "SELECT jobs.id, jobs.customer_id, jobs.title, jobs.description, jobs.status, jobs.due_date, jobs.created_at, jobs.updated_at, customers.name AS customer_name FROM jobs JOIN customers ON jobs.customer_id = customers.id WHERE jobs.id = $1 AND jobs.user_id = $2";
    const jobValues = [jobId, userId];
    const result = await pool.query(jobQuery, jobValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = Number(req.params.id);

  const { title, description, status, due_date } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Number.isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ message: "Invalid job id" });
  }

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  const allowedStatus = ["pending", "in_progress", "completed"];

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
  }

  if (status !== undefined && !allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status type" });
  }
  if (due_date !== undefined && typeof Number.isNaN(Date.parse(due_date))) {
    return res.status(400).json({ message: "Invalid date format" });
  }
  let trimmedTitle = title ? title.trim() : null;
  let trimmedDescription = description ? description.trim() : null;

  try {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (title !== undefined) {
      updates.push(`title=$${values.length + 1}`);
      values.push(trimmedTitle);
    }
    if (description !== undefined) {
      updates.push(`description=$${values.length + 1}`);
      values.push(trimmedDescription);
    }
    if (status !== undefined) {
      updates.push(`status=$${values.length + 1}`);
      values.push(status);
    }
    if (due_date !== undefined) {
      updates.push(`due_date=$${values.length + 1}`);
      values.push(due_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid field provided" });
    }
    values.push(jobId);
    values.push(userId);

    const jobQuery = `UPDATE jobs SET ${updates.join(", ")} WHERE id=$${values.length - 1} AND user_id =$${values.length} RETURNING *`;
    const result = await pool.query(jobQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (Number.isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ message: "Invalid job id" });
  }

  try {
    const jobQuery = "DELETE FROM jobs WHERE id=$1 AND user_id=$2 RETURNING *";
    const jobValues = [jobId, userId];

    const result = await pool.query(jobQuery, jobValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
