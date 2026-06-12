import { Socket, Server } from "socket.io";
import Chat from "../models/ChatsModel";
import Message from "../models/MessageModel";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
    console.log(`socket ${socket.id} joined ${chatId}`);
  });

  socket.on("leave-chat", (chatId: string) => {
    socket.leave(chatId);
  });

  socket.on("send-message", async (data) => {
    const { chatId, senderId, content } = data;

    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message,
    });

    io.to(chatId).emit("receive-message", message);
  });
};
