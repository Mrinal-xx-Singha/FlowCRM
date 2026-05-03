import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "id" in decoded &&
      typeof decoded.id === "number"
    ) {
      req.user = { id: decoded.id };
      return next();
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
};

export default authMiddleware;
