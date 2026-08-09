// ============================================================
// routes/user.routes.js - USER ROUTES
//
// These routes REQUIRE a valid JWT token (protected routes).
// authMiddleware checks the token before the controller runs.
// authorizeRoles("ADMIN") means ONLY admins can access that route.
// ============================================================

import express from "express";
import { getMyProfile, getAllUsers } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// GET /api/users/profile
// Protected: must be logged in
router.get("/profile", authMiddleware, getMyProfile);

// GET /api/users/all
// Protected: must be logged in AND must be ADMIN
router.get("/all", authMiddleware, authorize("ADMIN"), getAllUsers);

export default router;
