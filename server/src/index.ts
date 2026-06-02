import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/dbConnect";
import authRoutes from "./routes/auth.route";
import authMiddleware from "./middleware/auth.middleware";
import customerRoutes from "./routes/customer.route";
import jobsRoutes from "./routes/jobs.route";
import dashboardRoutes from "./routes/dashboard.route"
import reminderRoutes from "./routes/reminder.route"
import userRoutes from "./routes/user.route"
import { startCronJob } from "./services/cron.service"
import rateLimit from "express-rate-limit";


const app = express();
app.use(cors());
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers 
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});

app.use(globalLimiter);


app.use("/auth", authRoutes);
app.use("/api", authMiddleware, userRoutes)
app.use("/api", authMiddleware, customerRoutes);
app.use("/api", authMiddleware, jobsRoutes);
app.use("/api", authMiddleware, reminderRoutes);
app.use("/api", authMiddleware, dashboardRoutes)

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  await startCronJob();
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();
