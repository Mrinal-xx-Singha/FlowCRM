import express from "express";
import {
  dashboardSummaryHandler,
  upcomingRemindersHandler,
  recentJobsHandler,
} from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/dashboard/summary", dashboardSummaryHandler);
router.get("/dashboard/upcoming-reminders", upcomingRemindersHandler);
router.get("/dashboard/recent-jobs", recentJobsHandler);
export default router;
