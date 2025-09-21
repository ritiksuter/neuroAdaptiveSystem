import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketAuth.middleware.js";
import { InteractionLog } from "../models/interactionLog.model.js";
import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";
import { AdaptiveAction } from "../models/adaptiveAction.model.js";
import { computeSessionMetrics } from "./metrics.util.js";
import { decideAdaptiveActions } from "./adaptationEngine.js";
import { saveEmotionSnapshot } from "../services/emotion.service.js";
import { processAdaptiveActions } from "../services/adaptation.service.js";



export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // adjust for production to your frontend URL
      methods: ["GET", "POST"],
    },
  });

  // Middleware for authentication
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Join user to a session-specific room
    socket.on("joinSession", (sessionId) => {
      socket.join(sessionId);
      console.log(`User ${socket.user.name} joined session ${sessionId}`);
    });

    // Handle real-time interactions from client
    socket.on("interaction", async (data) => {
      try {
        const { sessionId, eventType, payload } = data;

        // Save interaction to DB
        const log = await InteractionLog.create({
          session: sessionId,
          user: socket.user._id,
          eventType,
          payload,
        });

        // Optionally broadcast to others in the same session
        socket.to(sessionId).emit("interaction", log);
      } catch (err) {
        console.error("Interaction save error:", err.message);
      }
    });

    // Handle emotion snapshots from client (e.g., from ML/Camera)
    socket.on("emotionSnapshot", async (data) => {
      try {
        const { sessionId, frameData } = data;

        const snapshot = await saveEmotionSnapshot({
          session: sessionId,
          user: socket.user._id,
          frameData,
        });

        // Emit to session room
        socket.to(sessionId).emit("emotionSnapshot", snapshot);
      } catch (err) {
        console.error("Emotion snapshot save error:", err.message);
      }
    });

    // Optional: End session and compute adaptive actions in real-time
    socket.on("endSession", async (sessionId) => {
      try {
        // Fetch session data
        const interactionLogs = await InteractionLog.find({ session: sessionId });
        const emotionSnapshots = await EmotionSnapshot.find({ session: sessionId });

        const metrics = computeSessionMetrics({ interactionLogs, emotionSnapshots, attempts: [] });

        // Decide adaptive actions
        const actions = await processAdaptiveActions({ sessionId, metrics, userId: socket.user._id });

        io.to(sessionId).emit("adaptiveActions", actions);
      } 
      catch (err) {
        console.error("Error ending session in real-time:", err.message);
      }
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
    });
  });

  return io;
};