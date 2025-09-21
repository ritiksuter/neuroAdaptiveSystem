import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createAdaptiveAction, deleteActionsBySession, getActionsByUser, resolveAction } from '../controllers/adaptations.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.post("/", authMiddleware, createAdaptiveAction);
router.get("/user/:userId", authMiddleware, getActionsByUser);
router.patch("/resolve/:actionId", authMiddleware, resolveAction);
router.delete('/session/:sessionId', authMiddleware, requireRole("admin"), deleteActionsBySession);

export default router;