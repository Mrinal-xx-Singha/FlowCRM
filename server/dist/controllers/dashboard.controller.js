"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recentJobsHandler = exports.upcomingRemindersHandler = exports.dashboardSummaryHandler = void 0;
const dbConnect_1 = require("../db/dbConnect");
const dashboardSummaryHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const [customersResult, totalJobsResult, pendingJobsResult, inProgressJobsResult, completedJobsResult, pendingRemindersResult, overdueRemindersResult,] = await Promise.all([
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS total_customers
        FROM customers
        WHERE user_id = $1
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS total_jobs
        FROM jobs
        WHERE user_id = $1
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS pending_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'pending'
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS in_progress_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'in_progress'
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS completed_jobs
        FROM jobs
        WHERE user_id = $1
        AND status = 'completed'
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS pending_reminders
        FROM reminders
        WHERE user_id = $1
        AND status = 'pending'
        `, [userId]),
            dbConnect_1.pool.query(`
        SELECT COUNT(*) AS overdue_reminders
        FROM reminders
        WHERE user_id = $1
        AND status = 'pending'
        AND remind_at < NOW()
        `, [userId]),
        ]);
        return res.status(200).json({
            total_customers: Number(customersResult.rows[0].total_customers),
            total_jobs: Number(totalJobsResult.rows[0].total_jobs),
            pending_jobs: Number(pendingJobsResult.rows[0].pending_jobs),
            in_progress_jobs: Number(inProgressJobsResult.rows[0].in_progress_jobs),
            completed_jobs: Number(completedJobsResult.rows[0].completed_jobs),
            pending_reminders: Number(pendingRemindersResult.rows[0].pending_reminders),
            overdue_reminders: Number(overdueRemindersResult.rows[0].overdue_reminders),
        });
    }
    catch (error) {
        console.error("❌ Error in dashboard handler", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
exports.dashboardSummaryHandler = dashboardSummaryHandler;
// Implement upcoming reminders and recent jobs handlers
const upcomingRemindersHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const upcomingRemindersResult = await dbConnect_1.pool.query(`
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
      `, [userId]);
        return res.status(200).json({
            reminders: upcomingRemindersResult.rows,
        });
    }
    catch (error) {
        console.error("❌ Error in upcoming reminders handler", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
exports.upcomingRemindersHandler = upcomingRemindersHandler;
const recentJobsHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const recentJobsResult = await dbConnect_1.pool.query(`
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
      `, [userId]);
        return res.status(200).json({
            jobs: recentJobsResult.rows,
        });
    }
    catch (error) {
        console.error("❌ Error in recent jobs handler", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
exports.recentJobsHandler = recentJobsHandler;
