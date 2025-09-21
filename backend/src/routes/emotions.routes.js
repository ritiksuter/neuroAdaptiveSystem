import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createEmotionSnapshot, deleteSnapshotsBySession, getSnapshotsBySession, getSnapshotsByUser } from '../controllers/emotions.controller.js';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.post("/", authMiddleware, createEmotionSnapshot);
router.get("/session/:sessionId", authMiddleware, getSnapshotsBySession);
router.get("/user/:userId", authMiddleware, getSnapshotsByUser);
router.delete("/session/:sessionId", authMiddleware, requireRole("admin"), deleteSnapshotsBySession);


export default router;