// ============================================================
// app.js - EXPRESS APPLICATION MOUNTING & SECURITY MIDDLEWARE
// ============================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import locationRoutes from "./routes/location.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { authRateLimiter, apiRateLimiter } from "./config/rateLimiter.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// 3. Body parsers with limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 4. General Rate Limiter for all APIs
app.use("/api", apiRateLimiter);

// 5. Health check
app.get("/", (req, res) => {
  res.json({ message: "✅ CivicLens API is running securely!" });
});

// 6. Routes Mounting
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);

// 7. Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;