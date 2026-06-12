import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, string>();

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
  socket.on("user-online", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user-online", userId);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user-offline", userId);
      }
    }
  });
};
