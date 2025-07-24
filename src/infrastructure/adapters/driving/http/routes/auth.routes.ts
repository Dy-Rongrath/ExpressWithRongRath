import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller";

const router = Router();

// Local Authentication
router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
