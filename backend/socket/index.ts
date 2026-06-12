// backend/socket/index.ts

import { Server, Socket } from "socket.io";
import Chat from "../models/ChatsModel";
import Message from "../models/MessageModel";
import User from "../models/UserModel";

const onlineUsers = new Map<string, Set<string>>();

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("✅ Connected:", socket.id);

    /* ---------- SETUP ---------- */
    socket.on("setup", async (userId: string) => {
      try {
        console.log("👤 setup joined:", userId, socket.id);

        socket.join(userId);

        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }

        onlineUsers.get(userId)?.add(socket.id);

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: null,
        });

        io.emit("online_users", Array.from(onlineUsers.keys()));
        socket.broadcast.emit("user_online", userId);
      } catch (error) {
        console.error("❌ setup error:", error);
      }
    });

    /* ---------- JOIN CHAT ---------- */
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
    });

    /* ---------- SEND MESSAGE ---------- */
    socket.on("send_message", async (data) => {
      try {
        const { chatId, senderId, content, type = "text" } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          content,
          type,
          status: "sent",
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name phoneNumber profilePhoto")
          .lean();

        chat.lastMessage = message._id;

        if (!chat.unreadCounts) chat.unreadCounts = new Map();

        chat.users.forEach((uid: any) => {
          const id = uid.toString();

          if (id !== senderId.toString()) {
            const prev = chat.unreadCounts!.get(id) || 0;
            chat.unreadCounts!.set(id, prev + 1);
          }
        });

        chat.markModified("unreadCounts");
        await chat.save();

        chat.users.forEach((uid: any) => {
          const id = uid.toString();

          if (id !== senderId.toString()) {
            io.to(id).emit("new_message", populatedMessage);
          }
        });

        io.to(chatId).emit("message_sent", populatedMessage);
      } catch (err) {
        console.error("❌ Send message error:", err);
      }
    });

    /* ---------- TYPING ---------- */
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { userId });
    });

    socket.on("stop_typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("stop_typing", { userId });
    });

    /* ---------- DELIVERED ---------- */
    socket.on("message_delivered", async ({ chatId, userId }) => {
      try {
        await Message.updateMany(
          {
            chat: chatId,
            sender: { $ne: userId },
            status: "sent",
          },
          {
            status: "delivered",
            deliveredAt: new Date(),
          },
        );

        socket.to(chatId).emit("message_delivered");
      } catch (err) {
        console.error("❌ Delivered error:", err);
      }
    });

    /* ---------- READ ---------- */
    socket.on("message_read", async ({ chatId, userId }) => {
      try {
        await Message.updateMany(
          {
            chat: chatId,
            sender: { $ne: userId },
            status: { $ne: "read" },
          },
          {
            status: "read",
            readAt: new Date(),
          },
        );

        const chat = await Chat.findById(chatId);

        if (chat?.unreadCounts) {
          chat.unreadCounts.set(userId.toString(), 0);
          chat.markModified("unreadCounts");
          await chat.save();
        }

        socket.to(chatId).emit("message_read");
      } catch (err) {
        console.error("❌ Read error:", err);
      }
    });

    /* ---------- CALL ---------- */
    socket.on("call_user", ({ to, from, type }) => {
      try {
        console.log("📞 call_user received:", { to, from, type });

        io.to(to).emit("incoming_call", {
          from,
          type,
        });
      } catch (error) {
        console.error("❌ call_user error:", error);
      }
    });

    socket.on("accept_call", ({ to, type }) => {
      io.to(to).emit("call_accepted", { type });
    });

    socket.on("reject_call", ({ to }) => {
      io.to(to).emit("call_rejected");
    });

    socket.on("end_call", ({ to }) => {
      io.to(to).emit("call_ended");
    });

    /* ---------- WEBRTC ---------- */
    socket.on("offer", ({ to, offer, type }) => {
      io.to(to).emit("offer", {
        from: socket.id,
        offer,
        type, // ✅ important fix
      });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice_candidate", ({ to, candidate }) => {
      io.to(to).emit("ice_candidate", {
        from: socket.id,
        candidate,
      });
    });

    /* ---------- DISCONNECT ---------- */
    socket.on("disconnect", async () => {
      console.log("❌ Disconnected:", socket.id);

      let disconnectedUserId: string | null = null;

      for (const [userId, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);

          if (sockets.size === 0) {
            onlineUsers.delete(userId);
            disconnectedUserId = userId;
          }

          break;
        }
      }

      if (disconnectedUserId) {
        try {
          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          io.emit("user_offline", {
            userId: disconnectedUserId,
            lastSeen: new Date(),
          });

          io.emit("online_users", Array.from(onlineUsers.keys()));
        } catch (err) {
          console.error("❌ Disconnect error:", err);
        }
      }
    });
  });
};
