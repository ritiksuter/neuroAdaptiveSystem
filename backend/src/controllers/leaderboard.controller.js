import { LeaderboardEntry } from "../models/leaderboardEntry.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";

// CREATE or UPDATE a leaderboard entry for a student
export const upsertLeaderboardEntry = async (req, res, next) => {
  try {
    const { studentId, score, sessionId } = req.body;

    // Validate student exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Optional: validate session exists
    let session = null;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session) return res.status(404).json({ message: "Session not found" });
    }

    // Find existing entry
    let entry = await LeaderboardEntry.findOne({ student: studentId, session: sessionId });

    if (entry) {
      // Update score
      entry.score = score;
      await entry.save();
    } else {
      // Create new entry
      entry = await LeaderboardEntry.create({
        student: studentId,
        score,
        session: sessionId,
      });
    }

    // Recalculate ranks
    await recalculateRanks(sessionId);

    return res.status(200).json({
      message: "Leaderboard entry upserted successfully",
      entry,
    });
  } catch (err) {
    next(err);
  }
};


// GET the full leaderboard (optionally by session)
export const getLeaderboard = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.sessionId) filter.session = req.query.sessionId;

    const leaderboard = await LeaderboardEntry.find(filter)
      .sort({ rank: 1 }) // rank ascending
      .populate("student", "name email");

    return res.status(200).json(leaderboard);
  } catch (err) {
    next(err);
  }
};


// DELETE a leaderboard entry (admin)
export const deleteLeaderboardEntry = async (req, res, next) => {
  try {
    const { entryId } = req.params;

    const deleted = await LeaderboardEntry.findByIdAndDelete(entryId);
    if (!deleted) return res.status(404).json({ message: "Leaderboard entry not found" });

    // Recalculate ranks after deletion
    await recalculateRanks(deleted.session);

    return res.status(200).json({ message: "Leaderboard entry deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// Helper function to recalculate ranks based on scores
const recalculateRanks = async (sessionId = null) => {
  const filter = {};
  if (sessionId) filter.session = sessionId;

  const entries = await LeaderboardEntry.find(filter).sort({ score: -1 });

  for (let i = 0; i < entries.length; i++) {
    entries[i].rank = i + 1;
    await entries[i].save();
  }
};