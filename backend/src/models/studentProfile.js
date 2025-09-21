import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    preferredPace: {
      type: String,
      enum: ["slow", "normal", "fast"],
      default: "normal",
    },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "mixed"],
      default: "mixed",
    },
    baselineMetrics: {
      avgResponseTime: { type: Number, default: 0 }, // in seconds
      baselineAccuracy: { type: Number, default: 0 }, // percentage
      baselineCognitiveLoad: { type: Number, default: 0 }, // scale 0-1
    },
    consent: {
      webcam: { type: Boolean, default: false },
      dataSharing: { type: Boolean, default: false },
    },
    timezone: {
      type: String,
      default: "UTC",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure each user has only one profile
studentProfileSchema.index({ user: 1 }, { unique: true });

export const StudentProfile = model("StudentProfile", studentProfileSchema);