import express, { Application, Request, Response } from "express";

// Create the Express application instance
const app: Application = express();

// A simple test route
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

export default app;
