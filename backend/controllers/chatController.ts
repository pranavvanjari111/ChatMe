import type { Request, Response } from "express";
import User from "../models/UserModel";
import Chat from "../models/ChatsModel";

const getUnreadCount = (chat: any, userId: any) => {
  const uid = userId.toString();
  if (!chat.unreadCounts) return 0;
  const value =
    typeof chat.unreadCounts.get === "function"
      ? chat.unreadCounts.get(uid)
      : chat.unreadCounts[uid];
  return value || 0;
};

const formatChat = (chat: any, loggedInUserId: any) => {
  const unreadCount = getUnreadCount(chat, loggedInUserId);

  if (!chat.isGroupChat) {
    const receiver = chat.users.find(
      (user: any) => user._id.toString() !== loggedInUserId.toString()
    );

    return {
      ...(chat.toObject?.() || chat),
      name: receiver?.name || receiver?.phoneNumber || "Unknown",
      profilePhoto: receiver?.profilePhoto || "",
      unreadCount,
    };
  }

  return { ...(chat.toObject?.() || chat), unreadCount };
};

/* ---------- GET USER CHATS ---------- */
export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const chats = await Chat.find({ users: userId })
      .populate("users", "name phoneNumber profilePhoto isOnline lastSeen")
      .populate({
        path: "lastMessage",
        select: "content createdAt sender",
        populate: { path: "sender", select: "name phoneNumber" },
      })
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map((chat) => formatChat(chat, userId));

    res.status(200).json({ success: true, data: formattedChats });
  } catch (err) {
    console.error("Get chats error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ---------- CREATE ONE-TO-ONE CHAT ---------- */
export const createOneToOneChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { phoneNumber } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const receiver = await User.findOne({ phoneNumber });

    if (!receiver) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check for existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, receiver._id] },
    }).populate("users", "name phoneNumber profilePhoto isOnline lastSeen");

    if (chat) {
      return res.status(200).json({ success: true, data: formatChat(chat, userId) });
    }

    const newChat = await Chat.create({
      isGroupChat: false,
      users: [userId, receiver._id],
      unreadCounts: {
        [userId.toString()]: 0,
        [receiver._id.toString()]: 0,
      },
    });

    chat = await Chat.findById(newChat._id).populate(
      "users",
      "name phoneNumber profilePhoto isOnline lastSeen"
    );

    res.status(201).json({ success: true, data: formatChat(chat, userId) });
  } catch (err) {
    console.error("Create chat error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
