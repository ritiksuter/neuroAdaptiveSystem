import { AdaptiveAction } from "../models/adaptiveAction.model.js";
import { Attempt } from "../models/attempt.model.js";
import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";
import { InteractionLog } from "../models/interactionLog.model.js";
import { Session } from "../models/session.model.js";
import { computeSessionMetrics } from "../utils/metrics.util.js";

export const generateSessionReport = async (sessionId) => {
  // 1. Fetch session
  const session = await Session.findById(sessionId)
    .populate("user", "name email role")
    .populate("activeQuestion", "questionText"); // optional

  if (!session) {
    throw new Error("Session not found");
  }

  // 2. Fetch related data
  const [interactionLogs, emotionSnapshots, attempts, adaptiveActions] = await Promise.all([
    InteractionLog.find({ session: sessionId }).sort({ timestamp: 1 }),
    EmotionSnapshot.find({ session: sessionId }).sort({ timestamp: 1 }),
    Attempt.find({ session: sessionId }),
    AdaptiveAction.find({ session: sessionId }).sort({ appliedAt: 1 }),
  ]);

  // 3. Compute aggregated metrics
  const metrics = computeSessionMetrics({ interactionLogs, emotionSnapshots, attempts });

  // 4. Format report
  const report = {
    sessionId: session._id,
    user: session.user,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    status: session.status,
    activeQuestion: session.activeQuestion || null,
    metrics,
    totalInteractions: interactionLogs.length,
    totalAttempts: attempts.length,
    emotionSnapshots,
    adaptiveActions,
  };

  return report;
};


export const generateUserReport = async (userId) => {
  // 1. Fetch all sessions for the user
  const sessions = await Session.find({ user: userId }).sort({ startedAt: -1 });

  // 2. Fetch reports for each session
  const sessionReports = [];
  for (const session of sessions) {
    const report = await generateSessionReport(session._id);
    sessionReports.push(report);
  }

  return {
    userId,
    totalSessions: sessions.length,
    sessions: sessionReports,
  };
};

export const generateAdminSummaryReport = async () => {
  const sessions = await Session.find();
  const summary = [];

  for (const session of sessions) {
    const metrics = await computeSessionMetrics({
      interactionLogs: await InteractionLog.find({ session: session._id }),
      emotionSnapshots: await EmotionSnapshot.find({ session: session._id }),
      attempts: await Attempt.find({ session: session._id }),
    });

    summary.push({
      sessionId: session._id,
      user: session.user,
      status: session.status,
      metrics,
    });
  }

  return summary;
};