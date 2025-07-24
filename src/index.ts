import app from "./infrastructure/webserver/server";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/database";

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
