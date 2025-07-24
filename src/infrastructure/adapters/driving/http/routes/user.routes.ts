import { Router } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         description: Bearer token for authentication
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

// Protected route

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Note:** You must include an Authorization header with a valid Bearer token.
 *       Example: `Authorization: Bearer <your_token>`
 *     responses:
 *       '200':
 *         description: The user's profile
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
 *       '401':
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, getProfile);

export default router;

/**
 * @swagger
 * tags:
 * name: Users
 * description: User management and authentication
 */
