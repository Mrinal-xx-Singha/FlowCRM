import { Request,Response } from "express";
import { pool } from "../db/db";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All Fields are required" });
    }
    let trimmedName = name.trim()
    let normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim()

    
    const userQuery =
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email";
    let saltRounds = 10;
    let hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds);
   

    const values = [trimmedName, normalizedEmail, hashedPassword];

    const user = await pool.query(userQuery, values);
    return res.status(201).json(user.rows[0]);
  } catch (err) {
    console.error("Error registering User", err);
    if(typeof err === "object" && err !== null && "code" in err && err.code === "23505"){
        return res.status(409).json({error:"Email already exists"})
    }
    return res.status(400).json({ error: "Internal server error" });
  }
};

export const login = async(req:Request,res:Response)=>{

}