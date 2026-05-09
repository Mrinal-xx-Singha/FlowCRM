import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createReminder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { title, notes, remind_at, status, customer_id, job_id } = req.body;

  const allowedStatus = ["pending", "sent"];

  // parse customer_id and job_id to numbers if they are provided, otherwise set to null
  const customerId = customer_id !== undefined ? Number(customer_id) : null;

  const jobId = job_id !== undefined ? Number(job_id) : null;

  // require at least one relation
  if (customerId === null && jobId === null) {
    return res.status(400).json({
      message: "Reminder must be linked to a customer or job",
    });
  }

  // validate customer id
  if (customerId !== null && (Number.isNaN(customerId) || customerId <= 0)) {
    return res.status(400).json({
      message: "Invalid customer id",
    });
  }

  // validate job id
  if (jobId !== null && (Number.isNaN(jobId) || jobId <= 0)) {
    return res.status(400).json({
      message: "Invalid job id",
    });
  }

  // validate title
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  // validate notes
  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({
      message: "Notes must be a string",
    });
  }

  // remind_at required
  if (typeof remind_at !== "string" || !remind_at.trim()) {
    return res.status(400).json({
      message: "remind_at is required",
    });
  }

  // validate date
  if (Number.isNaN(Date.parse(remind_at))) {
    return res.status(400).json({
      message: "Invalid date format for remind_at",
    });
  }

  // optional future-date validation
  if (new Date(remind_at) <= new Date()) {
    return res.status(400).json({
      message: "Reminder time must be in the future",
    });
  }

  // validate status
  if (status !== undefined && !allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid status type",
    });
  }

  const trimmedTitle = title.trim();

  const trimmedNotes = notes !== undefined ? notes.trim() : null;

  try {
    // verify customer ownership
    if (customerId !== null) {
      const customerQuery =
        "SELECT id FROM customers WHERE id = $1 AND user_id = $2";

      const customerResult = await pool.query(customerQuery, [
        customerId,
        userId,
      ]);

      if (customerResult.rowCount === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    // verify job ownership
    if (jobId !== null) {
      const jobQuery = "SELECT id FROM jobs WHERE id = $1 AND user_id = $2";

      const jobResult = await pool.query(jobQuery, [jobId, userId]);

      if (jobResult.rowCount === 0) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
    }

    const reminderQuery = `
      INSERT INTO reminders (
        user_id,
        customer_id,
        job_id,
        title,
        notes,
        remind_at,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;

    const reminderValues = [
      userId,
      customerId,
      jobId,
      trimmedTitle,
      trimmedNotes,
      remind_at,
      status || "pending",
    ];

    const reminderResult = await pool.query(reminderQuery, reminderValues);

    return res.status(201).json({
      message: "Reminder created",
      reminder: reminderResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
