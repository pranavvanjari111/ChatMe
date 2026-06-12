import mongoose, { Document, Schema } from "mongoose";

export interface ICall extends Document {
  caller: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;

  type: "audio" | "video";

  status: "initiated" | "ringing" | "ongoing" | "missed" | "rejected" | "ended";

  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // seconds

  createdAt: Date;
  updatedAt: Date;
}

const CallSchema: Schema<ICall> = new Schema(
  {
    caller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },

    status: {
      type: String,
      enum: ["initiated", "ringing", "ongoing", "missed", "rejected", "ended"],
      default: "initiated",
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    duration: {
      type: Number, // seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/* 🔥 INDEXES (IMPORTANT FOR PERFORMANCE) */
CallSchema.index({ chat: 1, createdAt: -1 });
CallSchema.index({ caller: 1, receiver: 1 });

/* 🔥 AUTO CALCULATE DURATION */
CallSchema.pre("save", function (next) {
  if (
    this.status === "ended" &&
    this.startedAt &&
    this.endedAt &&
    !this.duration
  ) {
    this.duration = Math.floor(
      (this.endedAt.getTime() - this.startedAt.getTime()) / 1000,
    );
  }
});

const Call = mongoose.model<ICall>("Call", CallSchema);
export default Call;
