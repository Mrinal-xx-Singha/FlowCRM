import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/dbConnect";
import { startCronJob } from "./services/cron.service";
import app from "./app";

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 8000;
  await startCronJob();
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();
