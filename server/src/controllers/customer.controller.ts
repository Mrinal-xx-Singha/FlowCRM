import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Zod has already trimmed, lowercased, and validated these!
    const { name, email, phone, notes } = req.body;

    const customerQuery = "INSERT INTO customers(user_id,name,phone,email,notes) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [userId, name, phone || null, email || null, notes || null];

    const customer = await pool.query(customerQuery, values);
    return res.status(201).json({ message: "Customer Created successfully", customer: customer.rows[0] });
    
  } catch (err) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "23505") {
      return res.status(409).json({ message: "A customer with this email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listAllCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const customerQuery = "SELECT id,name,email,phone,notes,created_at,updated_at FROM customers WHERE user_id=$1 ORDER BY created_at DESC";
    const result = await pool.query(customerQuery, [userId]);
    return res.status(200).json({ customers: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getACustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const customerId = Number(req.params.id); // Zod already guaranteed this is a valid number
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await pool.query(
      "SELECT id,name,email,phone,notes,created_at, updated_at FROM customers WHERE id= $1 AND user_id = $2",
      [customerId, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    return res.status(200).json({ customer: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const customerId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, phone, notes } = req.body;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { updates.push(`name = $${values.length + 1}`); values.push(name); }
    if (email !== undefined) { updates.push(`email = $${values.length + 1}`); values.push(email || null); }
    if (phone !== undefined) { updates.push(`phone = $${values.length + 1}`); values.push(phone || null); }
    if (notes !== undefined) { updates.push(`notes = $${values.length + 1}`); values.push(notes || null); }

    if (updates.length === 0) return res.status(400).json({ message: "No valid field provided" });
    
    values.push(customerId, userId);
    
    const customerQuery = `
      UPDATE customers SET ${updates.join(", ")}
      WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *
    `;

    const result = await pool.query(customerQuery, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    
    return res.status(200).json({ customer: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const customerId = Number(req.params.id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await pool.query("DELETE FROM customers WHERE id=$1 AND user_id =$2 RETURNING id", [customerId, userId]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};