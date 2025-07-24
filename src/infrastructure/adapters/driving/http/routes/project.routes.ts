import { Router } from "express";
import { createProject } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/rbac.middleware";

const router = Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Project Alpha"
 *               description:
 *                 type: string
 *                 example: "A new project for the Alpha release."
 *     responses:
 *       '201':
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 organizationId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       '400':
 *         description: Bad request or missing/invalid data
 *       '401':
 *         description: Unauthorized or insufficient permissions
 */
router.post(
  "/",
  authMiddleware,
  checkRole(["Org Admin", "Project Manager"]),
  createProject
);

export default router;
