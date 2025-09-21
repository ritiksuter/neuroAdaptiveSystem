import { AdaptiveAction } from "../models/adaptiveAction.model.js";
import { Session } from "../models/session.model.js";
import { processAdaptiveActions } from "../services/adaptation.service.js";

// CREATE a new adaptive action
export const createAdaptiveAction = async (req, res, next) => {
  try {
    const { sessionId, actionType, reason, rationale } = req.body;
    const userId = req.user?.id; // assuming auth middleware sets req.user

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

     const actions = await processAdaptiveActions({ sessionId, metrics: { actionType, reason, rationale }, userId });

    return res.status(201).json({
      message: "Adaptive action created successfully",
      actions,
    });
  } catch (err) {
    next(err);
  }
};

// GET all adaptive actions for a session
export const getActionsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const actions = await AdaptiveAction.find({ session: sessionId })
      .sort({ appliedAt: 1 }) // chronological order
      .populate("user", "name email role");

    return res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
};

// GET all adaptive actions for a specific user (optional filter by session)
export const getActionsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const filter = { user: userId };

    if (req.query.sessionId) filter.session = req.query.sessionId;

    const actions = await AdaptiveAction.find(filter)
      .sort({ appliedAt: 1 })
      .populate("session", "startedAt endedAt status")
      .populate("user", "name email role");

    return res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
};

// MARK an adaptive action as resolved
export const resolveAction = async (req, res, next) => {
  try {
    const { actionId } = req.params;

    const action = await AdaptiveAction.findByIdAndUpdate(
      actionId,
      { resolved: true },
      { new: true }
    );

    if (!action) {
      return res.status(404).json({ message: "Adaptive action not found" });
    }

    return res.status(200).json({
      message: "Adaptive action marked as resolved",
      action,
    });
  } catch (err) {
    next(err);
  }
};


// DELETE all adaptive actions for a session (admin)
export const deleteActionsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const result = await AdaptiveAction.deleteMany({ session: sessionId });

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} adaptive actions for session ${sessionId}`,
    });
  } catch (err) {
    next(err);
  }
};