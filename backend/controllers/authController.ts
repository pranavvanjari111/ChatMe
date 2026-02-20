import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/UserModel.js";

export const signUpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, phoneNumber, password } = req.body;

    if (!name || !phoneNumber || !password) {
      res.status(400).json({
        success: false,
        message: "All fields Are required",
      });

      return;
    }

    const isUser = await User.findOne({ phoneNumber });

    if (isUser) {
      res.status(409).json({
        success: false,
        message: "User already Exists",
      });

      return;
    }

    const user = await User.create({
      name,
      phoneNumber,
      password,
      about: "Hey there! I am using ChatMe",
      profilePhoto: "",
      lastSeen: null,
    });

    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      data: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Signup Error: ", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Problem",
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
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User does not exist",
      });

      return;
    }

    if (user.password !== password) {
      res.status(401).json({
        success: false,
        message: "Wrong Password",
      });

      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Server Problem",
    });
  }
};

export const logoutController = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
