import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import authRateLimit from "../middleware/auth.ratelimit.middleware";

const router = Router()

router.post("/register",authRateLimit,register)
router.post("/login",authRateLimit,login)


export default router
