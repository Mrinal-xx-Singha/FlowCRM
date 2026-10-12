import { Router } from "express";
import { draftEmailHandler } from "../controllers/ai.controller";
import { validate } from "../middleware/validate.middleware";
import { draftEmailSchema } from "../schemas/ai.schema";
const router = Router();

router.post("/ai/draft-email", validate(draftEmailSchema), draftEmailHandler);

export default router;