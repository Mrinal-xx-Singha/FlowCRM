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

// Get reminders with optional filters for status and upcoming reminders
export const getReminders = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const upcoming = req.query.upcoming === "true";

  const allowedStatus = ["pending", "sent"];

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Validate status filter
  if (status !== undefined && !allowedStatus.includes(String(status))) {
    return res.status(400).json({
      message: "Invalid status filter",
    });
  }

  try {
    const conditions: string[] = ["reminders.user_id = $1"];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;
    //  Status filter
    if (status !== undefined) {
      conditions.push(`reminders.status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    // Upcoming filter
    if (upcoming) {
      conditions.push(`reminders.remind_at > NOW()`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        reminders.*,
        customers.name AS customer_name,
        jobs.title AS job_title
      FROM reminders
      LEFT JOIN customers ON reminders.customer_id = customers.id
      LEFT JOIN jobs ON reminders.job_id = jobs.id
      ${whereClause}
      ORDER BY reminders.remind_at ASC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      reminders: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get a single reminder by ID
export const getReminderById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const reminderId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (Number.isNaN(reminderId) || reminderId <= 0) {
    return res.status(400).json({
      message: "Invalid reminder id",
    });
  }
  try {
    const reminderQuery = `
    SELECT reminders.id, reminders.customer_id,reminders.job_id, reminders.title, reminders.notes, reminders.remind_at, reminders.status
    FROM reminders
    WHERE reminders.id = $1 AND reminders.user_id = $2
    `;
    const reminderResult = await pool.query(reminderQuery, [
      reminderId,
      userId,
    ]);
    if (reminderResult.rowCount === 0) {
      return res.status(404).json({ Message: "Reminder not found" });
    }
    return res.status(200).json({ reminder: reminderResult.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


