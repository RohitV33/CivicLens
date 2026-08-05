// ============================================================
// app.js - THE HEART OF YOUR EXPRESS APPLICATION
// Here we:
//   1. Create the Express app
//   2. Add "middleware" (functions that run before your routes)
//   3. Register all our routes (auth, users, issues)
// ============================================================

import express from "express";
import cors from "cors";             // Allows frontend (different port) to talk to this backend
import cookieParser from "cookie-parser"; // Lets us read cookies from requests

// ---- Import all our route files ----
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import issueRoutes from "./routes/issue.routes.js";

// ---- Import global error handler ----
import { errorHandler } from "./middleware/error.middleware.js";

// Create the express application
const app = express();

// ============================================================
// MIDDLEWARE - These run on EVERY request before it hits a route
// ============================================================

// Allow requests from the React frontend running on port 5173 (Vite default)
// credentials: true allows sending cookies if needed in the future
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


// Allow the app to read JSON from request body  → req.body
app.use(express.json());

// Allow the app to read cookies from requests  → req.cookies
app.use(cookieParser());

// ============================================================
// ROUTES - Map URL paths to the correct route file
// ============================================================

// Health check - just to confirm the server is alive
app.get("/", (req, res) => {
  res.json({ message: "✅ CivicLens API is running!" });
});

// Auth routes  → /api/auth/register, /api/auth/login, /api/auth/logout
app.use("/api/auth", authRoutes);

// User routes  → /api/users/profile, /api/users/all
app.use("/api/users", userRoutes);

// Issue routes → /api/issues, /api/issues/:id
app.use("/api/issues", issueRoutes);

// ============================================================
// GLOBAL ERROR HANDLER - catches any error thrown in controllers
// This MUST be the last app.use()
// ============================================================
app.use(errorHandler);

export default app;