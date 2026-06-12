import { Server, Socket } from "socket.io";

export const registerTypingHandlers = (io: Server, socket: Socket) => {
  socket.on("typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("user-typing", userId);
  });

  socket.on("stop-typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("user-stop-typing", userId);
  });
};
