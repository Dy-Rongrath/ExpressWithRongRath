import { Router } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import passport from "passport";
import jwt from "jsonwebtoken";

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
 *       **How to use this endpoint in Swagger UI:**
 *       1. Log in using the `/users/login` endpoint and copy the `token` value from the response.
 *       2. Click the green **Authorize** button at the top right of Swagger UI.
 *       3. In the popup, paste your token in this format (including the word `Bearer` and a space):
 *          `Bearer <your_copied_token>`
 *       4. Click **Authorize** and then **Close**.
 *       5. Now, when you execute the `/users/me` request, Swagger will automatically include the Authorization header and you will get your profile.
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

// --- Google OAuth Routes ---

// 1. Route to start the Google authentication flow
router.get("/auth/google", passport.authenticate("google"));

// 2. Google's callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    // At this point, `req.user` is populated by Passport's verify callback
    const user = req.user as User;

    // We have the user, so we can generate our own JWT
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Send the token back to the client
    // In a real app, you'd redirect to your frontend with the token:
    // res.redirect(`https://yourapp.com/dashboard?token=${token}`);
    res.status(200).json({ token });
  }
);

export default router;

/**
 * @swagger
 * tags:
 * name: Users
 * description: User management and authentication
 */
