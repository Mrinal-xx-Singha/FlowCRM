"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUserProfile = exports.getCurrentUser = void 0;
const dbConnect_1 = require("../db/dbConnect");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userQuery = await dbConnect_1.pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [userId]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ id: user.id, name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, email } = req.body;
        const updateQuery = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email`;
        const updateResult = await dbConnect_1.pool.query(updateQuery, [name, email, userId]);
        const updatedUser = updateResult.rows[0];
        return res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email });
    }
    catch (error) {
        if (error.code === '23505') { // Unique violation error code in PostgreSQL
            return res.status(400).json({ message: "Email already in use" });
        }
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
const updateUserPassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { currentPassword, newPassword } = req.body;
        // Fetch the user's current password hash from the database
        const userQuery = await dbConnect_1.pool.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
        const user = userQuery.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the current password matches the database
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        // if it matches , hash and sabe the new password
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await dbConnect_1.pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hashedNewPassword, userId]);
        return res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUserPassword = updateUserPassword;
