import { Router } from "express";
import { createJobs,getJobs } from "../controllers/jobs.controller";

const router = Router();

router.post("/jobs", createJobs);
router.get("/jobs",getJobs)
export default router;
