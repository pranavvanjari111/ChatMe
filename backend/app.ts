import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

import { initSocket } from "./socket";
import { socketAuth } from "./middlewares/socketAuth";

import AuthRouter from "./routes/authRoutes";
import UserRouter from "./routes/userRoutes";
import ChatRouter from "./routes/chatRoutes";
import MessageRouter from "./routes/messageRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.set("trust proxy", 1);

/* ---------- ENV ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

/* ---------- CORS ---------- */
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  process.env.CLIENT_URL_ALT,
].filter((url): url is string => Boolean(url)); // removes undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

/* ---------- HEALTH CHECK ---------- */
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

/* ---------- SOCKET ---------- */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.use(socketAuth);
initSocket(io);

/* ---------- ROUTES ---------- */
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/message", MessageRouter);

/* ---------- MULTER + GLOBAL ERROR HANDLER ---------- */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large",
      });
    }
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ---------- DB + SERVER ---------- */
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

/* ---------- GRACEFUL SHUTDOWN ---------- */
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
