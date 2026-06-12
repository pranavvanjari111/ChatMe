import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  isGroupChat: boolean;
  chatName?: string;
  groupPhoto?: string;
  users: mongoose.Types.ObjectId[];
  admins?: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  unreadCounts?: Map<string, number>; // 🔥 NEW
}

const ChatSchema = new Schema<IChat>(
  {
    isGroupChat: { type: Boolean, default: false },

    chatName: {
      type: String,
      trim: true,
      required: function () {
        return this.isGroupChat;
      },
    },

    groupPhoto: {
      type: String,
      trim: true,
    },

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    /* 🔥 UNREAD SYSTEM */
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

/* 🔥 INDEXES */
ChatSchema.index({ users: 1 });
ChatSchema.index({ updatedAt: -1 });

export default mongoose.model<IChat>("Chat", ChatSchema);
