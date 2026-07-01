import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route";
import authMiddleware from "./middleware/auth.middleware";
import customerRoutes from "./routes/customer.route";
import jobsRoutes from "./routes/jobs.route";
import dashboardRoutes from "./routes/dashboard.route";
import reminderRoutes from "./routes/reminder.route";
import userRoutes from "./routes/user.route";
import cronRoutes from "./routes/cron.route"
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1); // Required for Render and rate limiting

app.use(cors({
  origin: process.env.FRONTEND_URL || "*", 
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true, 
  legacyHeaders: false, 
  skip: () => process.env.NODE_ENV === "test", // Bypass during tests
});

app.use(globalLimiter);

app.use("/auth", authRoutes);
app.use("/api", cronRoutes);
app.use("/api", authMiddleware, userRoutes);
app.use("/api", authMiddleware, customerRoutes);
app.use("/api", authMiddleware, jobsRoutes);
app.use("/api", authMiddleware, reminderRoutes);
app.use("/api", authMiddleware, dashboardRoutes);

export default app;
