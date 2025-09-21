import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const LeaderboardEntrySchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User', // reference to the User model
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    rank: {
      type: Number,
      required: true,
      default: 0,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session', // optional: track which session this score is for
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export const LeaderboardEntry =  model('LeaderboardEntry', LeaderboardEntrySchema);