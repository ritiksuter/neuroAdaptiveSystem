import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
    reportType: {
      type: String,
      enum: ["sessionSummary", "weekly", "memoryRetention"],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed, // JSON with analytics, charts, metrics
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // system or admin who generated
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index to quickly fetch reports for a user or session
reportSchema.index({ user: 1, reportType: 1, generatedAt: -1 });
reportSchema.index({ session: 1 });

export const Report = model("Report", reportSchema);