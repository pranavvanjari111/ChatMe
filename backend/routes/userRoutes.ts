import express from "express";
const UserRouter = express.Router();

import {
  getMyProfileController,
  updateAbout,
  updateName,
  updateProfilePhoto,
} from "../controllers/UserController";

import authMiddleware from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

UserRouter.get("/me", authMiddleware, getMyProfileController);

UserRouter.patch("/name", authMiddleware, updateName);
UserRouter.patch("/about", authMiddleware, updateAbout);

UserRouter.patch(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  updateProfilePhoto,
);

export default UserRouter;
