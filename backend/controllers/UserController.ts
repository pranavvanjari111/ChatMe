import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import User from "../models/UserModel";
import { uploadImage } from "../utils/uploadToCloudinary";

/* ---------- GET PROFILE ---------- */
export const getMyProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------- UPDATE NAME ---------- */
export const updateName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { name: user.name },
    });
  } catch (err) {
    console.error("Update name error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------- UPDATE ABOUT ---------- */
export const updateAbout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { about } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!about?.trim()) {
      res.status(400).json({
        success: false,
        message: "About is required",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { about: about.trim() },
      { new: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: { about: user.about },
    });
  } catch (err) {
    console.error("Update about error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ---------- UPDATE PROFILE PHOTO ---------- */
export const updateProfilePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!req.file || !req.file.mimetype.startsWith("image/")) {
      res.status(400).json({
        success: false,
        message: "Valid image file is required",
      });
      return;
    }

    /* 🔥 UPLOAD IMAGE */
    const imageUrl = await uploadImage(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: imageUrl },
      { new: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};
