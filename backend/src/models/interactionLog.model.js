import mongoose from "mongoose";
const { Schema, model } = mongoose;

const interactionLogSchema = new Schema(
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
    eventType: {
      type: String,
      enum: [
        "keystroke",
        "focus",
        "blur",
        "click",
        "response",
        "scroll",
        "videoFrame",
      ],
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed, // raw event data (flexible)
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Optimize for chronological queries in a session
interactionLogSchema.index({ session: 1, timestamp: 1 });

export const InteractionLog = model("InteractionLog", interactionLogSchema);