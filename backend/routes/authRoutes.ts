import express from "express";
const AuthRouter = express.Router();

import {
  signUpController,
  logInController,
  logoutController,
} from "../controllers/authController";

AuthRouter.post("/signup", signUpController);
AuthRouter.post("/login", logInController);

AuthRouter.post("/logout", logoutController);

export default AuthRouter;
