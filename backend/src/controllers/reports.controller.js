import { Report } from "../models/report.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";

// CREATE a new report
export const createReport = async (req, res, next) => {
  try {
    const { userId, sessionId, reportType, data } = req.body;
    const createdBy = req.user?.id; // assuming auth middleware sets req.user

    // Optional: validate user and session
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const report = await Report.create({
      user: userId,
      session: sessionId,
      reportType,
      data,
      createdBy,
    });

    return res.status(201).json({
      message: "Report generated successfully",
      report,
    });
  } catch (err) {
    next(err);
  }
};


// GET all reports (optional filters: userId, sessionId, reportType)
export const getAllReports = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;
    if (req.query.sessionId) filter.session = req.query.sessionId;
    if (req.query.reportType) filter.reportType = req.query.reportType;

    const reports = await Report.find(filter)
      .sort({ generatedAt: -1 })
      .populate("user", "name email role")
      .populate("session", "startedAt endedAt status")
      .populate("createdBy", "name email role");

    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
};


// GET a single report by ID
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("user", "name email role")
      .populate("session", "startedAt endedAt status")
      .populate("createdBy", "name email role");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};


// DELETE a report by ID (admin)
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    next(err);
  }
};