import express from "express";
import {
  dashboardSummaryHandler,
  upcomingRemindersHandler,
  recentJobsHandler,
  seedDemoDataHandler
} from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/dashboard/summary", dashboardSummaryHandler);
router.get("/dashboard/upcoming-reminders", upcomingRemindersHandler);
router.get("/dashboard/recent-jobs", recentJobsHandler);
router.post("/dashboard/seed",seedDemoDataHandler)
export default router;
