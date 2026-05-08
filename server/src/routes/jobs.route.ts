import { Router } from "express";
import { createJob,getJobs,getJob,updateJob } from "../controllers/jobs.controller";

const router = Router();

router.post("/jobs", createJob);
router.get("/jobs",getJobs)
router.get("/jobs/:id",getJob)
router.put("/jobs/:id",updateJob)
export default router;
