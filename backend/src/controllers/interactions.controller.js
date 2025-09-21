import { InteractionLog } from "../models/interactionLog.model.js";
import { Session } from "../models/session.model.js";

// CREATE a new interaction log
export const createInteraction = async (req, res, next) => {
  try {
    const { sessionId, eventType, payload } = req.body;
    const userId = req.user?.id; // assuming auth middleware sets req.user

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const interaction = await InteractionLog.create({
      session: sessionId,
      user: userId,
      eventType,
      payload,
    });

    return res.status(201).json({
      message: "Interaction logged successfully",
      interaction,
    });
  } catch (err) {
    next(err);
  }
};


// GET all interactions for a session
export const getInteractionsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const interactions = await InteractionLog.find({ session: sessionId })
      .sort({ timestamp: 1 }) // chronological order
      .populate("user", "name email role");

    return res.status(200).json(interactions);
  } catch (err) {
    next(err);
  }
};


// GET all interactions for a specific user (optional filter by session)
export const getInteractionsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const filter = { user: userId };

    if (req.query.sessionId) filter.session = req.query.sessionId;

    const interactions = await InteractionLog.find(filter)
      .sort({ timestamp: 1 })
      .populate("session", "startedAt endedAt status")
      .populate("user", "name email role");

    return res.status(200).json(interactions);
  } catch (err) {
    next(err);
  }
};


// DELETE all interactions for a session (admin)
export const deleteInteractionsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const result = await InteractionLog.deleteMany({ session: sessionId });

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} interactions for session ${sessionId}`,
    });
  } catch (err) {
    next(err);
  }
};
