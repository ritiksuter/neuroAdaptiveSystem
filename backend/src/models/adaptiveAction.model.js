import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adaptiveActionSchema = new Schema(
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
    actionType: {
      type: String,
      enum: [
        "simplify",
        "challenge",
        "suggestBreak",
        "changePace",
        "hint",
        "gamify",
      ],
      required: true,
    },
    reason: {
      type: String, // short explanation
      required: true,
      trim: true,
    },
    rationale: {
      type: Schema.Types.Mixed, // extra metrics/data that triggered action
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index for quick timeline lookups within a session
adaptiveActionSchema.index({ session: 1, appliedAt: 1 });

export const AdaptiveAction = model("AdaptiveAction", adaptiveActionSchema);