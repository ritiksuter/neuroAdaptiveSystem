import cron from "node-cron";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { Report } from "../models/report.model.js";
import { Attempt } from "../models/attempt.model.js";
import { InteractionLog } from "../models/interactionLog.model.js";
import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";
import {computeSessionMetrics} from '../utils/metrics.util.js';

/**
 * Generates a weekly report for each user
 */
const generateWeeklyReports = async () => {
  try {
    console.log("📊 Running scheduled job: Weekly Reports");

    // Fetch all users (you could filter active ones only)
    const users = await User.find({});

    for (const user of users) {
      // Get all sessions for this user in the past 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const sessions = await Session.find({
        user: user._id,
        startedAt: { $gte: oneWeekAgo },
      });

      if (!sessions.length) continue;

      const reportsData = [];

      for (const session of sessions) {
        const [attempts, interactionLogs, emotionSnapshots] = await Promise.all([
          Attempt.find({ session: session._id }),
          InteractionLog.find({ session: session._id }),
          EmotionSnapshot.find({ session: session._id }),
        ]);

        const metrics = computeSessionMetrics({
          interactionLogs,
          emotionSnapshots,
          attempts,
        });

        reportsData.push({
          sessionId: session._id,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          metrics,
        });
      }

      // Create a consolidated weekly report
      await Report.create({
        user: user._id,
        reportType: "weekly",
        data: {
          generatedAt: new Date(),
          totalSessions: reportsData.length,
          sessions: reportsData,
        },
        createdBy: null, // system-generated
      });

      console.log(`✅ Weekly report created for user ${user.name}`);
    }
  } catch (err) {
    console.error("❌ Error generating weekly reports:", err);
  }
};

/**
 * Schedule jobs
 * - Every Sunday at midnight → Weekly Reports
 */
export const initScheduledReports = () => {
  cron.schedule("0 0 * * 0", generateWeeklyReports); // Sunday 00:00
  console.log("⏰ Scheduled job registered: Weekly Reports (every Sunday at 00:00)");
};
