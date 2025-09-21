import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";
import { Session } from "../models/session.model.js";
import { saveEmotionSnapshot } from "../services/emotion.service.js";

// CREATE a new emotion snapshot
export const createEmotionSnapshot = async (req, res, next) => {
  try {
    const { sessionId, frameData } = req.body;
    const userId = req.user?.id; // assuming auth middleware sets req.user

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const snapshot = await saveEmotionSnapshot({
      sessionId,
      userId: req.user._id,
      frameData,
    });

    return res.status(201).json({
      message: "Emotion snapshot recorded successfully",
      snapshot,
    });
  } catch (err) {
    next(err);
  }
};


// GET all emotion snapshots for a session
export const getSnapshotsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const snapshots = await EmotionSnapshot.find({ session: sessionId })
      .sort({ timestamp: 1 }) // chronological order
      .populate("user", "name email role");

    return res.status(200).json(snapshots);
  } catch (err) {
    next(err);
  }
};

// GET all emotion snapshots for a user (optional filter by session)
export const getSnapshotsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const filter = { user: userId };

    if (req.query.sessionId) filter.session = req.query.sessionId;

    const snapshots = await EmotionSnapshot.find(filter)
      .sort({ timestamp: 1 })
      .populate("session", "startedAt endedAt status")
      .populate("user", "name email role");

    return res.status(200).json(snapshots);
  } catch (err) {
    next(err);
  }
};


// DELETE all snapshots for a session (admin)
export const deleteSnapshotsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const result = await EmotionSnapshot.deleteMany({ session: sessionId });

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} emotion snapshots for session ${sessionId}`,
    });
  } catch (err) {
    next(err);
  }
};