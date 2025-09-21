import mongoose from "mongoose";
const { Schema, model } = mongoose;

const attemptSchema = new Schema(
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
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: {
      type: Schema.Types.Mixed, // flexible (string, number, object, array)
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    timeTaken: {
      type: Number, // seconds
      default: 0,
    },
    retries: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      keystrokes: { type: Number, default: 0 },
      textToneScore: { type: Number, default: 0 }, // sentiment/engagement
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index for faster lookup per user/session/question
attemptSchema.index({ user: 1, session: 1, question: 1 });

export const Attempt = model("Attempt", attemptSchema);