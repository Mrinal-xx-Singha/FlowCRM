import { Router } from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobs.controller";
import { validate } from "../middleware/validate.middleware";
import { createJobSchema, getJobQuerySchema, jobIdSchema, updateJobSchema } from "../schemas/jobs.schema";

const router = Router();

router.post("/jobs",validate(createJobSchema), createJob);
router.get("/jobs",validate(getJobQuerySchema) ,getJobs);
router.get("/jobs/:id",validate(jobIdSchema) ,getJob);
router.patch("/jobs/:id",validate(updateJobSchema), updateJob);
router.delete("/jobs/:id", validate(jobIdSchema),deleteJob);


export default router;
