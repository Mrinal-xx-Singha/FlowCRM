import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createJobs = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: "Customer not found!" });
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

export const getJobs = async () => {};
