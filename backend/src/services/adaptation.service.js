import { AdaptiveAction } from "../models/adaptiveAction.model.js";
import { Session } from "../models/session.model.js";
import { decideAdaptiveActions } from "../utils/adaptationEngine.js";

export const processAdaptiveActions = async ({ sessionId, metrics, userId }) => {
  // 1. Validate session exists
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  // 2. Use adaptation engine to decide actions
  const actionsToApply = decideAdaptiveActions(metrics);
  if (!actionsToApply.length) return [];
  
  const savedActions = [];
  
  // 3. Save each action in DB
  for (const act of actionsToApply) {
    const action = await AdaptiveAction.create({
      session: sessionId,
      user: userId || session.user, // fallback to session user
      actionType: act.actionType,
      reason: act.reason,
      rationale: metrics,
    });
    savedActions.push(action);
  }

  return savedActions;
};


export const getActionsForSession = async (sessionId) => {
  return AdaptiveAction.find({ session: sessionId })
    .sort({ appliedAt: 1 })
    .populate("user", "name email role");
};



export const getActionsForUser = async (userId, sessionId = null) => {
  const filter = { user: userId };
  if (sessionId) filter.session = sessionId;

  return AdaptiveAction.find(filter)
    .sort({ appliedAt: 1 })
    .populate("session", "startedAt endedAt status")
    .populate("user", "name email role");
};


export const resolveAdaptiveAction = async (actionId) => {
  const action = await AdaptiveAction.findByIdAndUpdate(
    actionId,
    { resolved: true },
    { new: true }
  );

  if (!action) throw new Error("Adaptive action not found");

  return action;
};