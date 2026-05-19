import { Router, Request, Response } from "express";
import { pool } from "../db/dbConnect";

const router = Router();

router.get("/me", async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userQuery = await pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [userId]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})


export default router;