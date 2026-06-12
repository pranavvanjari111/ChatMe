import type { Request, Response } from "express";
import Message from "../models/MessageModel";
import Chat from "../models/ChatsModel";

/* ---------- SEND MESSAGE ---------- */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?._id;
    const { chatId, content, type = "text" } = req.body;

    if (!senderId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!chatId || (!content && type === "text")) {
      return res.status(400).json({ success: false, message: "Invalid message data" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.users.some((id: any) => id.toString() === senderId.toString())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const message = await Message.create({ chat: chatId, sender: senderId, content, type });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name phoneNumber profilePhoto")
      .lean();

    chat.lastMessage = message._id;

    if (!chat.unreadCounts) chat.unreadCounts = new Map();

    chat.users.forEach((userId: any) => {
      const uid = userId.toString();
      if (uid !== senderId.toString()) {
        const prev = chat.unreadCounts!.get(uid) || 0;
        chat.unreadCounts!.set(uid, prev + 1);
      }
    });

    chat.markModified("unreadCounts");
    await chat.save(); // FIX: removed duplicate save

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ---------- GET MESSAGES ---------- */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!chatId) return res.status(400).json({ success: false, message: "Chat ID is required" });

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.users.some((id: any) => id.toString() === userId.toString())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name phoneNumber profilePhoto")
      .sort({ createdAt: 1 })
      .lean();

    if (chat.unreadCounts) {
      chat.unreadCounts.set(userId.toString(), 0);
      chat.markModified("unreadCounts");
      await chat.save();
    }

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ---------- MARK AS DELIVERED ---------- */
export const markAsDelivered = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.body;
    if (!messageId) return res.status(400).json({ success: false, message: "Message ID required" });

    const message = await Message.findByIdAndUpdate(
      messageId,
      { status: "delivered", deliveredAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error("Delivered error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ---------- MARK AS READ ---------- */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.body;
    if (!messageId) return res.status(400).json({ success: false, message: "Message ID required" });

    const message = await Message.findByIdAndUpdate(
      messageId,
      { status: "read", readAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error("Read error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
