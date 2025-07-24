import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";
import userRoutes from "../adapters/driving/http/routes/user.routes";
import projectRoutes from "../adapters/driving/http/routes/project.routes";
import passport from "passport";
import { configurePassport } from "../config/passport";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());
configurePassport();

// --- Swagger UI Setup ---
// Serve Swagger docs at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

// Use user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);

export default app;
