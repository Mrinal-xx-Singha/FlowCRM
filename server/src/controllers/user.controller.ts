import { Request, Response } from 'express';
import { pool } from '../db/dbConnect';
import bcrypt from 'bcrypt';

export const getCurrentUser = async (req: Request, res: Response) => {
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
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, email } = req.body;
        const updateQuery = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email`;
        const updateResult = await pool.query(updateQuery, [name, email, userId]);
        const updatedUser = updateResult.rows[0];
        return res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { currentPassword, newPassword } = req.body;
        // Fetch the user's current password hash from the database
        const userQuery = await pool.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the current password matches the database
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        // if it matches , hash and sabe the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Replace with actual hashing logic
        await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hashedNewPassword, userId]);
        return res.json({ message: "Password updated successfully" });
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation error code in PostgreSQL
            return res.status(400).json({ message: "Email already in use" });
        }
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}       