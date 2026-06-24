import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import authRateLimit from "../middleware/auth.ratelimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
const router = Router()

router.post("/register",authRateLimit,validate(registerSchema),register)
router.post("/login",authRateLimit,validate(loginSchema),login)


export default router
