import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "paused", "ended"],
      default: "active",
    },
    activeQuestion: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    aggregateMetrics: {
      totalTime: { type: Number, default: 0 }, // in seconds
      avgResponseTime: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }, // percentage
      engagementScore: { type: Number, default: 0 }, // 0–1 scale
    },
    realtimeChannelId: {
      type: String, // for Socket.IO / WebRTC room
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index for efficient queries by user and start time
sessionSchema.index({ user: 1, startedAt: -1 });

export const Session = model("Session", sessionSchema);