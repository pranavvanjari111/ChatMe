import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/UserModel";
import { Request, Response, NextFunction } from "express";

interface JwtDecoded extends JwtPayload {
  id?: string;
  _id?: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1️⃣ Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Cookie fallback
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtDecoded;

    const userId = decoded.id || decoded._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // ✅ attach user
    req.user = {
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;
