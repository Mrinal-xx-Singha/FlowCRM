import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Zod has already perfectly validated the date, customer_id, and title!
    const { title, notes, remind_at, status, customer_id, job_id } = req.body;

    const parsedJobId = job_id ? Number(job_id) : null;

    // Verify customer ownership
    const customerResult = await pool.query("SELECT id FROM customers WHERE id = $1 AND user_id = $2", [customer_id, userId]);
    if (customerResult.rowCount === 0) return res.status(404).json({ message: "Customer not found" });

    // Verify job ownership if job_id exists
    if (parsedJobId !== null) {
      const jobResult = await pool.query("SELECT id FROM jobs WHERE id = $1 AND user_id = $2", [parsedJobId, userId]);
      if (jobResult.rowCount === 0) return res.status(404).json({ message: "Job not found" });
    }

    const reminderQuery = `
      INSERT INTO reminders (user_id, customer_id, job_id, title, notes, remind_at, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `;
    const reminderValues = [userId, customer_id, parsedJobId, title, notes || null, remind_at, status || "pending"];
    const reminderResult = await pool.query(reminderQuery, reminderValues);

    return res.status(201).json({ message: "Reminder created", reminder: reminderResult.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { status, upcoming } = req.query;

    const conditions: string[] = ["reminders.user_id = $1"];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;

    if (status) {
      conditions.push(`reminders.status = $${paramIndex}`);
      values.push(status as string);
      paramIndex++;
    }

    if (upcoming === "true") {
      conditions.push(`reminders.remind_at > NOW()`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `
      SELECT reminders.*, customers.name AS customer_name, jobs.title AS job_title
      FROM reminders
      LEFT JOIN customers ON reminders.customer_id = customers.id
      LEFT JOIN jobs ON reminders.job_id = jobs.id
      ${whereClause} ORDER BY reminders.remind_at ASC
    `;
    const result = await pool.query(query, values);
    return res.status(200).json({ reminders: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReminderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const reminderId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const reminderQuery = `
      SELECT reminders.*, customers.name AS customer_name, jobs.title AS job_title
      FROM reminders
      LEFT JOIN customers ON reminders.customer_id = customers.id
      LEFT JOIN jobs ON reminders.job_id = jobs.id
      WHERE reminders.id = $1 AND reminders.user_id = $2
    `;
    const reminderResult = await pool.query(reminderQuery, [reminderId, userId]);
    
    if (reminderResult.rowCount === 0) return res.status(404).json({ message: "Reminder not found" });
    return res.status(200).json({ reminder: reminderResult.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const reminderId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, notes, remind_at, status } = req.body;

    const checkResult = await pool.query("SELECT id FROM reminders WHERE id = $1 AND user_id = $2", [reminderId, userId]);
    if (checkResult.rowCount === 0) return res.status(404).json({ message: "Reminder not found" });

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (title !== undefined) { fields.push(`title = $${values.length + 1}`); values.push(title); }
    if (notes !== undefined) { fields.push(`notes = $${values.length + 1}`); values.push(notes || null); }
    if (remind_at !== undefined) { fields.push(`remind_at = $${values.length + 1}`); values.push(remind_at); }
    if (status !== undefined) { fields.push(`status = $${values.length + 1}`); values.push(status); }

    if (fields.length === 0) return res.status(400).json({ message: "No valid fields to update" });

    values.push(reminderId, userId);
    const updateQuery = `
      UPDATE reminders SET ${fields.join(", ")}
      WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, values);
    
    return res.status(200).json({ message: "Reminder updated", reminder: updateResult.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const reminderId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deleteResult = await pool.query("DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *", [reminderId, userId]);
    if (deleteResult.rowCount === 0) return res.status(404).json({ message: "Reminder not found" });
    
    return res.status(200).json({ message: "Reminder deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};