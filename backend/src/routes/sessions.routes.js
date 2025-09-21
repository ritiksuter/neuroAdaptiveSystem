import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { createSession, endSession, getAllSessions, getSessionById, updateSession } from '../controllers/sessions.controller.js';

const router = Router();

router.post('/', authMiddleware, requireRole("student"), createSession);
router.get('/', authMiddleware, requireRole("admin"), getAllSessions);
router.get('/:id', authMiddleware, getSessionById);
router.put('/:id', authMiddleware, updateSession);
router.post("/:id/end", authMiddleware, endSession);

export default router;