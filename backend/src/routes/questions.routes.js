import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, updateQuestion } from '../controllers/questions.controller.js';

const router = Router();

router.post("/", authMiddleware, requireRole("admin"), createQuestion);
router.get("/", authMiddleware, getAllQuestions);
router.get("/:id", authMiddleware, getQuestionById);
router.put("/:id", authMiddleware, requireRole("admin"), updateQuestion);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteQuestion);

export default router;