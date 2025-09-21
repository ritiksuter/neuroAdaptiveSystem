import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/users.controller.js";
import {requireRole} from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, requireRole("admin"), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;