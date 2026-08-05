// ============================================================
// routes/auth.routes.js - AUTH ROUTES
//
// WHAT IS A ROUTE?
// A route maps an HTTP method + URL path to a controller function.
// Example: POST /api/auth/register  → calls registerUser controller
//
// These routes do NOT require login (they are public)
// ============================================================

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/register  → Create a new account
router.post("/register", registerUser);

// POST /api/auth/login     → Login with email + password, get a JWT token back
router.post("/login", loginUser);

// POST /api/auth/logout    → Logout (client just deletes the token)
router.post("/logout", logoutUser);

export default router;