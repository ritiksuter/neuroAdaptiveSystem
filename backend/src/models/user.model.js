import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    lastActiveAt: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: Schema.Types.Mixed, // flexible field for extra info
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Index for faster lookups on email
userSchema.index({ email: 1 });

export const User = model("User", userSchema);