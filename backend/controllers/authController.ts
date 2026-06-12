import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/UserModel";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const signUpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, phoneNumber, password } = req.body;

    if (!name || !phoneNumber || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logInController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const user = await User.findOne({ phoneNumber });

    if (!user || user.password !== hashPassword(password)) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutController = (_req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
