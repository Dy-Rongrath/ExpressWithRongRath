import { Router, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../../../../../core/domain/user";

const router = Router();

// Route to initiate Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Callback route that Google will redirect to
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req: Request, res: Response) => {
    // User object is attached by Passport's verify callback
    const user = req.user as User;

    // Issue our own JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // In a real app, you'd redirect to your frontend with the token
    // e.g., res.redirect(`https://my-frontend.com/login-success?token=${token}`);
    res.status(200).json({ token });
  }
);

export default router;
