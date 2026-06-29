import { Router, Request, Response } from "express";
import { getCurrentUser, updateUserProfile, updateUserPassword } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { updateUserProfileSchema, updateUserPasswordSchema } from "../schemas/user.schema";

const router = Router();

router.get("/me", getCurrentUser);
router.patch("/profile", validate(updateUserProfileSchema), updateUserProfile);
router.patch("/password", validate(updateUserPasswordSchema), updateUserPassword);

export default router;