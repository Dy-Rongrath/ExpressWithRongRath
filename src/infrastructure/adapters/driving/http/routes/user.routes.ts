import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user and organization
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - organizationName
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               organizationName:
 *                 type: string
 *                 example: "Doe Incorporated"
 *     responses:
 *       '201':
 *         description: User and organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 organizationId:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad request, such as user with this email already exists
 */
router.post("/register", registerUser);
export default router;

/**
 * @swagger
 * tags:
 * name: Users
 * description: User management and authentication
 */
