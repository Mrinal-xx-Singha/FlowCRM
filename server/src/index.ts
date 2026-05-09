import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/dbConnect";
import authRoutes from "./routes/auth.route";
import authMiddleware from "./middleware/auth.middleware";
import customerRoutes from "./routes/customer.route";
import jobsRoutes from "./routes/jobs.route";
import dashboardRoutes from "./routes/dashboard.route"
import reminderRoutes from "./routes/reminder.route"


const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", authMiddleware, customerRoutes);
app.use("/api", authMiddleware, jobsRoutes);
app.use("/api", authMiddleware, reminderRoutes);
app.use("/api",authMiddleware,dashboardRoutes)

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();
