import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";
import passport from "passport";

// --- Import Routes ---
import authRoutes from "../adapters/driving/http/routes/auth.routes";
import userRoutes from "../adapters/driving/http/routes/user.routes";
import projectRoutes from "../adapters/driving/http/routes/project.routes";

// --- Configurations ---
import "../config/passport"; // Executes passport configuration

const app: Application = express();

// --- Middleware ---
app.use(express.json());
app.use(passport.initialize());

// --- API Documentation ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Health Check ---
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

// --- API Routes ---
app.use("/api/v1/auth", authRoutes); // All auth routes are here
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);

export default app;
