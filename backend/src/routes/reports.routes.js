import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createReport, deleteReport, getAllReports, getReportById } from '../controllers/reports.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();


router.post("/", authMiddleware, createReport);
router.get("/", authMiddleware, getAllReports);
router.get("/:id", authMiddleware, getReportById);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteReport);


export default router;