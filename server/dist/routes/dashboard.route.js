"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
router.get("/dashboard/summary", dashboard_controller_1.dashboardSummaryHandler);
router.get("/dashboard/upcoming-reminders", dashboard_controller_1.upcomingRemindersHandler);
router.get("/dashboard/recent-jobs", dashboard_controller_1.recentJobsHandler);
exports.default = router;
