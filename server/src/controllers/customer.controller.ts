import { Request, Response } from "express";
import { pool } from "../db/db";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, email, phone, notes } = req.body;

    const sanitizedEmail = email ? email.trim().toLowerCase() : null;
    const sanitizedPhone = phone ? phone.trim() : null;
    const sanitizedNotes = notes ? notes.trim() : null;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Name of the customer is required" });
    }
    const customerQuery =
      "INSERT INTO customers(user_id,name,phone,email,notes) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [
      userId,
      name,
      sanitizedPhone,
      sanitizedEmail,
      sanitizedNotes,
    ];

    const customer = await pool.query(customerQuery, values);

    return res.status(201).json({
      message: "Customer Created successfully",
      customer: customer.rows[0],
    });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "23505"
    ) {
      return res
        .status(409)
        .json({ message: "Customer with this email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const listAllCustomer = (req: Request, res: Response) => {};
export const getACustomer = (req: Request, res: Response) => {};
export const updateCustomer = (req: Request, res: Response) => {};
export const deleteCustomer = (req: Request, res: Response) => {};
