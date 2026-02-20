import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

/* ---------- middlewares ---------- */
app.use(cors());
app.use(express.json());

/* ---------- test route ---------- */
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

/* ---------- DB + Server ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
