import mongoose from "mongoose";
const { Schema, model } = mongoose;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Question content is required"], // can be text/markdown
    },
    type: {
      type: String,
      enum: ["mcq", "coding", "short", "numeric"],
      required: true,
    },
    choices: [
      {
        type: String,
        trim: true,
      },
    ], // for MCQ
    correctAnswer: {
      type: Schema.Types.Mixed, // flexible (string, number, array, object)
      required: true,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    estimatedTime: {
      type: Number, // in seconds
      default: 60,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Indexes for search and filtering
questionSchema.index({ tags: 1 });
questionSchema.index({ difficulty: 1 });

export const Question = model("Question", questionSchema);