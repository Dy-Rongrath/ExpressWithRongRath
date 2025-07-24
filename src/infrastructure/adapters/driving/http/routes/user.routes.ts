import { Router } from "express";
import { getMyProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All routes in this file are protected by the authMiddleware
router.use(authMiddleware);

router.get("/me", getMyProfile);

export default router;
