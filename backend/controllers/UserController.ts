import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/UserModel.js";

export const checkContactOnChatMeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        message: "Phone number is required",
      });

      return;
    }

    const iscontact = await User.exists({ phoneNumber });
    if (!iscontact) {
      res.status(404).json({
        success: false,
        message: "this contact is not on the ChaMe",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contact found",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Server Problem",
    });
  }
};

export const getMyProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        about: user.about,
        profilePhoto: user.profilePhoto,
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

export const updateAbout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { about } = req.body;
    const id = req.user._id;
    if (!about) {
      res.status(400).json({
        success: false,
        message: "the About is not Provided",
      });

      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { about },
      { new: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not exist",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "About updates Successfully",
    });
  } catch (error) {
    console.error("Error ", error);
    res.status(500).json({
      success: false,
      message: "Server Problem",
    });
  }
};
