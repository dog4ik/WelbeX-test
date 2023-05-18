import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type TokenData = {
  id: string;
};

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, token_data) => {
    if (err) return res.status(401).json({ message: "Token is not valid" });
    let token = token_data as TokenData;
    res.set("user_id", token.id);
    req.body.user_id = token.id;
    next();
  });
}
