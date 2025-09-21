import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { login, register, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();


router.post("/register", authLimiter, register);
router.post("/login", login);
router.get("/verify/:userId", verifyEmail);

export default router;