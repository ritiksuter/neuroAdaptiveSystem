import {Router} from 'express';
import { deleteLeaderboardEntry, getLeaderboard, upsertLeaderboardEntry } from '../controllers/leaderboard.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();


router.post("/", authMiddleware, requireRole("admin"), upsertLeaderboardEntry);
router.get("/", authMiddleware, getLeaderboard);
router.delete("/:entryId", authMiddleware, requireRole("admin"), deleteLeaderboardEntry);


export default router;