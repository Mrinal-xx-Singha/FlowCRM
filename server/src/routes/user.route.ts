import { Router, Request, Response } from "express";
import { pool } from "../db/dbConnect";
import { getCurrentUser,updateUserProfile,updateUserPassword } from "../controllers/user.controller";

const router = Router();

router.get("/me",getCurrentUser);
router.patch("/profile",updateUserProfile)
router.patch("/password",updateUserPassword)


export default router;