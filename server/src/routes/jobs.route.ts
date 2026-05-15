import { Router } from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobs.controller";

const router = Router();

router.post("/jobs", createJob);
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJob);
router.patch("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
export default router;
