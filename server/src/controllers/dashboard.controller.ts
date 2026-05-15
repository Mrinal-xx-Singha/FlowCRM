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
    });
  } catch (error) {
    console.error("❌ Error in dashboard handler", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const upcomingRemindersHandler = async (req: Request, res: Response) => {};
const recentJobsHandler = async (req: Request, res: Response) => {};
export { dashboardSummaryHandler, upcomingRemindersHandler, recentJobsHandler };
