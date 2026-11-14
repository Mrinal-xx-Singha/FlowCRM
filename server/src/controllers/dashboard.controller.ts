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

const seedDemoDataHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // 1. Insert 4 realistic Customers (uses ON CONFLICT to prevent duplicates)

    const customersQuery = `
      INSERT INTO customers (user_id, name, email, phone, notes)
      VALUES
        ($1, 'Nexus Mobility Pvt Ltd', 'rahul.verma@nexusmobility.in', '+91 98201 44521', 'Leading EV fleet operator in Pune. Looking for telematics analytics and custom API integration.'),
        ($1, 'Kaveri Cloud Solutions', 'ananya.sen@kavericloud.io', '+91 80412 88910', 'Cloud consultancy with 50+ engineers. Requires enterprise SLA and quarterly data exports.'),
        ($1, 'Zomato Kitchens Hub', 'partnerships@cloudkitchen-hub.com', '+91 99304 12874', 'Multi-brand cloud kitchen partner. Streamlining invoice tracking across 12 outlets.'),
        ($1, 'BlueWave Logistics', 'ops@bluewavelogistics.com', '+91 97112 55430', 'Cold-chain logistics network across Delhi NCR. High deal velocity.')
      ON CONFLICT (user_id, email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name;
    `;
    const custRes = await client.query(customersQuery, [userId])
    const cMap = new Map(custRes.rows.map((r: any) => [r.name, r.id]))

    const nexusId = cMap.get("Nexus Mobility Pvt Ltd")
    const kaveriId = cMap.get("Kaveri Cloud Solutions");
    const zomatoId = cMap.get("Zomato Kitchens Hub");
    const blueWaveId = cMap.get("BlueWave Logistics");

    // 2.Insert 6 Deals accross Pending, In Progress, and Completed

    const jobQuery = `
    INSERT INTO jobs (user_id, customer_id, title, description, status, deal_value, due_date)
    VALUES
        ($1, $2, 'EV Fleet Telematics Integration', 'Deploy live GPS and battery health reporting pipelines.', 'pending', 145000, NOW() + INTERVAL '7 days'),
        ($1, $3, 'Annual Cloud Security Audit', 'SOC2 and ISO 27001 vulnerability assessment and compliance report.', 'in_progress', 85000, NOW() + INTERVAL '3 days'),
        ($1, $4, 'Multi-Outlet Billing Pipeline', 'Automate point-of-sale invoice sync across 12 cloud kitchens.', 'in_progress', 220000, NOW() + INTERVAL '14 days'),
        ($1, $5, 'Cold Storage Tracking App', 'Real-time temperature IoT alert system for dairy logistics.', 'completed', 310000, NOW() - INTERVAL '2 days'),
        ($1, $3, 'Quarterly Cloud Retainer', 'Dedicated DevOps infrastructure support and optimization.', 'completed', 60000, NOW() - INTERVAL '5 days'),
        ($1, $5, 'Warehouse Route Optimization', 'AI-assisted dispatch planner for Gurgaon delivery hubs.', 'pending', 125000, NOW() + INTERVAL '10 days')
        RETURNING id,title;
    `;
    const jobRes = await client.query(jobQuery, [userId, nexusId, kaveriId, zomatoId, blueWaveId])
    const jMap = new Map(jobRes.rows.map((r: any) => [r.title, r.id]))

    // Insert 3 reminders (1 OverDue, 2 Upcoming)
    const reminderQuery = `
      INSERT INTO reminders (user_id, customer_id, job_id, title, notes, remind_at, status)
      VALUES
        ($1, $2, $3, 'Contract Review with Rahul', 'Confirm telemetry SLA terms before signing.', NOW() - INTERVAL '2 hours', 'pending'),
        ($1, $4, $5, 'Deliver Final Security Report', 'Send executive PDF summary to Ananya.', NOW() + INTERVAL '2 days', 'pending'),
        ($1, $6, $7, 'Quarterly Review Call', 'Discuss outlet expansion plans for next quarter.', NOW() + INTERVAL '5 days', 'pending');
    `
    await client.query(reminderQuery, [
      userId,
      nexusId,
      jMap.get("EV Fleet Telematics Integration") || null,
      kaveriId,
      jMap.get("Annual Cloud Security Audit") || null,
      zomatoId,
      jMap.get("Multi-Outlet Billing Pipeline") || null,
    ])

    await client.query("COMMIT")
    return res.status(201).json({
      message:"Sample pipeline data loaded successfully!!"
    })


  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error seeding demo data:",error)
    return res.status(500).json({error:"Failed to seed demo data"})

  }finally{
    client.release()
  }
}

export { dashboardSummaryHandler, upcomingRemindersHandler, recentJobsHandler,seedDemoDataHandler };
