import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db";
import authRoutes from "./routes/auth.route";
import authMiddleware from "./middleware/auth.middleware";
import customerRoutes from "./routes/customer.route";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/api", authMiddleware, customerRoutes);

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();
