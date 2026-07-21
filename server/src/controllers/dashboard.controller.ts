import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

const dashboardSummaryHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const [
      customersResult,
      totalJobsResult,
      pendingJobsResult,
      inProgressJobsResult,
      completedJobsResult,
      pendingRemindersResult,
      overdueRemindersResult,
      productivityDataResult
    ] = await Promise.all([
      pool.query(
        `
        SELECT COUNT(*) AS total_customers
        FROM customers
        WHERE user_id = $1
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS total_jobs
        FROM jobs
        WHERE user_id = $1
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS pending_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'pending'
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS in_progress_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'in_progress'
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS completed_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'completed'
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS pending_reminders
        FROM reminders
        WHERE user_id = $1
        AND status = 'pending'
        `,
        [userId],
      ),

      pool.query(
        `
        SELECT COUNT(*) AS overdue_reminders
        FROM reminders
        WHERE user_id = $1
        AND status = 'pending'
        AND remind_at < NOW()
        `,
        [userId],
      ),
      pool.query(
        `SELECT 
          TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
          COUNT(*) as jobs_completed
        FROM jobs
        WHERE user_id = $1 
          AND status = 'completed'
          AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '5 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at) ASC   
        `,
        [userId]
      )

    ]);

    return res.status(200).json({
      total_customers: Number(customersResult.rows[0].total_customers),

      total_jobs: Number(totalJobsResult.rows[0].total_jobs),

      pending_jobs: Number(pendingJobsResult.rows[0].pending_jobs),

      in_progress_jobs: Number(inProgressJobsResult.rows[0].in_progress_jobs),

      completed_jobs: Number(completedJobsResult.rows[0].completed_jobs),

      pending_reminders: Number(
        pendingRemindersResult.rows[0].pending_reminders,
      ),

      overdue_reminders: Number(
        overdueRemindersResult.rows[0].overdue_reminders,
      ),
      productivity_data: productivityDataResult.rows.map(row => ({
        month: row.month,
        jobs_completed: Number(row.jobs_completed)
      }))
    });
  } catch (error) {
    console.error("❌ Error in dashboard handler", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Implement upcoming reminders and recent jobs handlers
const upcomingRemindersHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const upcomingRemindersResult = await pool.query(
      `
    SELECT
      reminders.id,
      reminders.title,
      reminders.remind_at,
      customers.name AS customer_name,
      jobs.title AS job_title
      FROM reminders
      LEFT JOIN customers
      ON reminders.customer_id = customers.id
      LEFT JOIN jobs
      ON reminders.job_id = jobs.id
      WHERE reminders.user_id = $1
      AND reminders.status = 'pending'
      AND reminders.remind_at > NOW()
      ORDER BY reminders.remind_at ASC
    LIMIT 5
      `,
      [userId],
    );
    return res.status(200).json({
      reminders: upcomingRemindersResult.rows,
    });
  } catch (error) {
    console.error("❌ Error in upcoming reminders handler", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const recentJobsHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const recentJobsResult = await pool.query(
      `
    SELECT
      jobs.id,
      jobs.title,
      jobs.status,
      jobs.created_at,
      customers.name AS customer_name
      FROM jobs
      LEFT JOIN customers
      ON jobs.customer_id = customers.id
      WHERE jobs.user_id = $1
      ORDER BY jobs.created_at DESC
    LIMIT 5
      `,
      [userId],
    );
    return res.status(200).json({
      jobs: recentJobsResult.rows,
    });
  } catch (error) {
    console.error("❌ Error in recent jobs handler", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { dashboardSummaryHandler, upcomingRemindersHandler, recentJobsHandler };
