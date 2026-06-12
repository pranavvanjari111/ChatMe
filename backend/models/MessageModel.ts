import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content?: string;
  type: "text" | "image";
  status: "sent" | "delivered" | "read";
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: Date,
    readAt: Date,
  },
  { timestamps: true },
);

/* 🔥 IMPORTANT INDEXES */
MessageSchema.index({ chat: 1, createdAt: 1 });

/* 🔥 VALIDATION */
MessageSchema.pre("save", async function () {
  if (this.type === "text" && !this.content) {
    throw new Error("Message content cannot be empty");
  }
});

export default mongoose.model<IMessage>("Message", MessageSchema);
