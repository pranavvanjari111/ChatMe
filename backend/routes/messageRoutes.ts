import express from "express";
import {
  sendMessage,
  getMessages,
  markAsDelivered,
  markAsRead,
} from "../controllers/messageController";
import authMiddleware from "../middlewares/authMiddleware";

const MessageRouter = express.Router();

MessageRouter.post("/", authMiddleware, sendMessage);

MessageRouter.get("/:chatId", authMiddleware, getMessages);

MessageRouter.patch("/delivered", authMiddleware, markAsDelivered);

MessageRouter.patch("/read", authMiddleware, markAsRead);

export default MessageRouter;
