import express from "express";
const ChatRouter = express.Router();

import {
  createOneToOneChat,
  getUserChats,
} from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";
ChatRouter.post("/createChat", authMiddleware, createOneToOneChat);
ChatRouter.get("/getChats", authMiddleware, getUserChats);
export default ChatRouter;
