import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createInteraction, deleteInteractionsBySession, getInteractionsBySession, getInteractionsByUser } from '../controllers/interactions.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', authMiddleware, createInteraction);
router.get('/session/sessionId', authMiddleware, getInteractionsBySession);
router.get("/user/:userId", authMiddleware, getInteractionsByUser);
router.delete('/session/:sessionId', authMiddleware, requireRole("admin"), deleteInteractionsBySession);


export default router;