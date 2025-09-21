import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


/**
 * Socket.IO authentication middleware
 * Verifies JWT sent from client and attaches user to socket
 */

export const socketAuth = async (socket, next) => {
  try {
    // Expect token in handshake auth (socket.handshake.auth.token)
    const token = socket.handshake.auth?.token;

    if (!token) {
      const err = new Error("Authentication token missing");
      err.data = { content: "Please provide a valid token" };
      return next(err);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object to socket
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const err = new Error("User not found or inactive");
      err.data = { content: "Invalid token" };
      return next(err);
    }

    socket.user = user; // accessible in event handlers
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    err.data = { content: "Authentication failed" };
    next(err);
  }
};