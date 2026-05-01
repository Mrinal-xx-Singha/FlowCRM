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
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = decoded
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Credentails" });
  }
};

export default authMiddleware;
