import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuth = (socket: any, next: any) => {
  try {
    // Prefer token sent explicitly by the client (works even when
    // browser tracking-prevention blocks the auth cookie on the
    // WebSocket handshake — common in Edge/Safari).
    let token = socket.handshake.auth?.token;

    if (!token) {
      const cookie = socket.handshake.headers.cookie;
      if (cookie) {
        token = cookie
          .split("; ")
          .find((c: string) => c.startsWith("token="))
          ?.split("=")[1];
      }
    }

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    socket.data.user = decoded;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
