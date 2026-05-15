import { Request, Response } from "express";
import { pool } from "../db/dbConnect";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, email, phone, notes } = req.body;

    const trimmedName = name ? name.trim() : null;
    const sanitizedEmail = email ? email.trim().toLowerCase() : null;
    const sanitizedPhone = phone ? phone.trim() : null;
    const sanitizedNotes = notes ? notes.trim() : null;

    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }
    if (!name.trim()) {
      return res
        .status(400)
        .json({ message: "Name of the customer is required" });
    }
    if (email !== undefined && typeof email !== "string") {
      return res.status(400).json({ message: "Email must be a string" });
    }
    if (phone !== undefined && typeof phone !== "string") {
      return res.status(400).json({ message: "Phone must be a string" });
    }
    if (notes !== undefined && typeof notes !== "string") {
      return res.status(400).json({ message: "Notes must be a string" });
    }

    const customerQuery =
      "INSERT INTO customers(user_id,name,phone,email,notes) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [
      userId,
      trimmedName,
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
      return res.status(409).json({
        message: "A customer with this email already exists for this user",
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const listAllCustomer = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const customerQuery =
      "SELECT id,name,email,phone,notes,created_at,updated_at FROM customers WHERE user_id=$1 ORDER BY created_at DESC";
    const values = [userId];
    const result = await pool.query(customerQuery, values);
    return res.status(200).json({ customers: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getACustomer = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const customerId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (Number.isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid customer id" });
  }
  try {
    const customerQuery =
      "SELECT id,name,email,phone,notes,created_at, updated_at FROM customers WHERE id= $1 AND user_id = $2";
    const values = [customerId, userId];
    const result = await pool.query(customerQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ customer: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const customerId = Number(req.params.id);
  const { name, email, phone, notes } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Number.isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid customer id" });
  }
  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ message: "Name must be a string" });
  }
  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (email !== undefined && typeof email !== "string") {
    return res.status(400).json({ message: "Email must be a string" });
  }
  if (phone !== undefined && typeof phone !== "string") {
    return res.status(400).json({ message: "Phone must be a string" });
  }

  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({ message: "Notes must be a string" });
  }

  let trimmedName = name ? name.trim() : null;
  let sanitizedEmail = email ? email.trim().toLowerCase() : null;
  let trimmedPhone = phone ? phone.trim() : null;
  let trimmedNotes = notes ? notes.trim() : null;

  try {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(trimmedName);
    }
    if (email !== undefined) {
      updates.push(`email = $${values.length + 1}`);
      values.push(sanitizedEmail);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${values.length + 1}`);
      values.push(trimmedPhone);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${values.length + 1}`);
      values.push(trimmedNotes);
    }
    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid field provided" });
    }
    values.push(customerId);
    values.push(userId);
    const customerQuery = `
  UPDATE customers
  SET ${updates.join(", ")}
  WHERE id = $${values.length - 1} AND user_id = $${values.length}
  RETURNING *
`;

    const result = await pool.query(customerQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({ customer: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const customerId = Number(req.params.id);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (Number.isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid customer id" });
  }

  try {
    const customerQuery =
      "DELETE FROM customers WHERE id=$1 AND user_id =$2 RETURNING id";
    const values = [customerId, userId];
    const result = await pool.query(customerQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
