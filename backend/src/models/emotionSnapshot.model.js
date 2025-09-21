// models/EmotionSnapshot.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const emotionSnapshotSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    emotions: {
      happy: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
      surprise: { type: Number, default: 0 },
      disgust: { type: Number, default: 0 },
      fear: { type: Number, default: 0 },
    },
    engagement: {
      type: Number, // scale 0–1
      default: 0,
    },
    confusion: {
      type: Number, // scale 0–1
      default: 0,
    },
    stress: {
      type: Number, // scale 0–1
      default: 0,
    },
    frameUrl: {
      type: String, // optional link to stored image/frame
    },
    modelVersion: {
      type: String, // which ML model version was used
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index for fast chronological retrieval within sessions
emotionSnapshotSchema.index({ session: 1, timestamp: 1 });

export const EmotionSnapshot = model("EmotionSnapshot", emotionSnapshotSchema);