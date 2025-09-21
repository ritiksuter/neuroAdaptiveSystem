import { Attempt } from "../models/attempt.model.js";
import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";
import { InteractionLog } from "../models/interactionLog.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { computeSessionMetrics } from "../utils/metrics.util.js";
import { decideAdaptiveActions } from "../utils/adaptationEngine.js";
import { AdaptiveAction } from "../models/adaptiveAction.model.js";

// CREATE a new session
export const createSession = async (req, res, next) => {
  try {
    const { userId, activeQuestion, realtimeChannelId } = req.body;

    // Optional: validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await Session.create({
      user: userId,
      activeQuestion,
      realtimeChannelId,
    });

    return res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (err) {
    next(err);
  }
};

// GET all sessions (optionally filter by user)
export const getAllSessions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;

    const sessions = await Session.find(filter)
      .populate("user", "name email role")
      .populate("activeQuestion");

    return res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};

// GET a single session by ID
export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("user", "name email role")
      .populate("activeQuestion");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

// UPDATE session status or active question
export const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const session = await Session.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email role")
      .populate("activeQuestion");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({
      message: "Session updated successfully",
      session,
    });
  } catch (err) {
    next(err);
  }
};

// END a session
export const endSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(400).json({ message: "Session already ended" });
    }

    session.status = "ended";
    session.endedAt = new Date();

    // --- Compute metrics ---
    const interactionLogs = await InteractionLog.find({ session: id });
    const emotionSnapshots = await EmotionSnapshot.find({ session: id });
    const attempts = await Attempt.find({ session: id });

    const metrics = computeSessionMetrics({
      interactionLogs,
      emotionSnapshots,
      attempts,
    });

    session.aggregateMetrics = metrics;

    // --- Decide adaptive actions based on metrics ---
    const adaptiveActions = await processAdaptiveActions({ sessionId: id, metrics, userId: session.user });

    await session.save();

    return res.status(200).json({
      message: "Session ended successfully",
      session,
      adaptiveActions,
    });
  } catch (err) {
    next(err);
  }
};
