

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  closeDatabaseConnection,
  connectToDatabase,
} from "./config/database.js";
// import { errorHandler } from "./utils/errorHandler";

// Load environment variables from .env file
// This must be called before any other imports that use environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    name: "MongoDB Sample MFlix API",
    version: "1.0.0",
    description:
      "Express.js backend demonstrating MongoDB operations with the sample_mflix dataset",
    endpoints: {
      movies: "/api/movies",
      documentation: "/api-docs",
    },
  });
});

/**
 * Global Error Handler
 * This middleware catches any unhandled errors and returns a consistent error response
 * It should be the last middleware in the chain
 */
// app.use(errorHandler);
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDatabase();
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log("\nReceived SIGINT. Shutting down...");
  closeDatabaseConnection();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM. Shutting down...");
  closeDatabaseConnection();
  process.exit(0);
});

export { app };

if (require.main === module) {
  startServer();
}