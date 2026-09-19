import { Router } from "express";
import { googleLogin, login, register } from "../controllers/auth.controller";
import authRateLimit from "../middleware/auth.ratelimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
const router = Router()

router.post("/register",authRateLimit,validate(registerSchema),register)
router.post("/login",authRateLimit,validate(loginSchema),login)
router.post("/google",googleLogin)


export default router
