import { Request, Response } from "express";
import { pool } from "../db/dbConnect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    let trimmedName = name.trim();
    let normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const userQuery =
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email";
    let saltRounds = 10;
    let hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds);

    const values = [trimmedName, normalizedEmail, hashedPassword];

    const user = await pool.query(userQuery, values);
    return res.status(201).json(user.rows[0]);
  } catch (err) {
    console.error("Error registering User", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "23505"
    ) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required !" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await pool.query(
      "SELECT id,name,email,password_hash FROM users WHERE email = $1",
      [normalizedEmail],
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const dbUser = user.rows[0];
    const trimmedPassword = password.trim();

    const isMatch = await bcrypt.compare(trimmedPassword, dbUser.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: dbUser.id }, process.env.JWT_SECRET as string, {
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
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
