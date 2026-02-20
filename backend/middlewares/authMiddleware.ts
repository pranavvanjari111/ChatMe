import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/UserModel.js";
import { Request, Response, NextFunction } from "express";

interface JwtDecoded extends JwtPayload {
  id: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "No token provided",
      });

      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtDecoded;

    const account = await User.findById(decoded.id).select("-password");

    if (!account) {
      res.status(401).json({
        message: "Account not found",
      });

      return;
    }

    req.user = account;
    next();
  } catch (error: any) {
    console.error("Auth Error: ", error.message);
    res.status(401).json({
      message: "Invalid or expired token",
    });
    return;
  }
};

export default authMiddleware;
