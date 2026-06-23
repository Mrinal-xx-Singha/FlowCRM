"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const dbConnect_1 = require("../db/dbConnect");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All Fields are required" });
        }
        let trimmedName = name.trim();
        let normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        const userQuery = "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email";
        let saltRounds = 10;
        let hashedPassword = await bcrypt_1.default.hash(trimmedPassword, saltRounds);
        const values = [trimmedName, normalizedEmail, hashedPassword];
        const user = await dbConnect_1.pool.query(userQuery, values);
        return res.status(201).json(user.rows[0]);
    }
    catch (err) {
        console.error("Error registering User", err);
        if (typeof err === "object" &&
            err !== null &&
            "code" in err &&
            err.code === "23505") {
            return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required !" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await dbConnect_1.pool.query("SELECT id,name,email,password_hash FROM users WHERE email = $1", [normalizedEmail]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const dbUser = user.rows[0];
        const trimmedPassword = password.trim();
        const isMatch = await bcrypt_1.default.compare(trimmedPassword, dbUser.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: dbUser.id }, process.env.JWT_SECRET, {
            expiresIn: req.body.rememberMe ? "30d" : "1d",
        });
        return res.status(200).json({
            token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
