"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.googleLogin = void 0;
const dbConnect_1 = require("../db/dbConnect");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
// Initialize the client with the ID
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
    try {
        // The token sent from the frontend
        const { token } = req.body;
        // Verify the token with Google's Servers 
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ error: "Invalid Google Token" });
        const email = payload.email;
        const name = payload.name || "Google User";
        // Check if user already exists in DB
        const userResult = await dbConnect_1.pool.query("SELECT * FROM users WHERE email=$1", [email]);
        let user = userResult.rows[0];
        // If they dont exist, create an account for them automatically
        if (!user) {
            // We generate a random impossible password since they login via Google
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt_1.default.hash(randomPassword, 10);
            const insertResult = await dbConnect_1.pool.query("INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING *", [name, email, hashedPassword]);
            user = insertResult.rows[0];
        }
        // Generate your normal JWT token
        const jwtToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        return res.status(200).json({ token: jwtToken, user: {
                id: user.id,
                name: user.name,
                email: user.email
            } });
    }
    catch (error) {
        console.error("Google Auth Error", error);
        return res.status(500).json({ error: "Google authentication failed" });
    }
};
exports.googleLogin = googleLogin;
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userQuery = "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email";
        let saltRounds = 10;
        let hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const values = [name, email, hashedPassword];
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
        const user = await dbConnect_1.pool.query("SELECT id,name,email,password_hash FROM users WHERE email = $1", [email]);
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
