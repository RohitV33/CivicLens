// ============================================================
// routes/auth.routes.js - AUTH ROUTES WITH ZOD VALIDATION
// ============================================================

import express from "express";
import {
  registerUser,
  loginUser,
  googleLoginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, googleAuthSchema } from "../validators/auth.validator.js";

const router = express.Router();

// POST /api/auth/register -> Create account with validation
router.post("/register", validate(registerSchema), registerUser);

// POST /api/auth/login -> Login with validation
router.post("/login", validate(loginSchema), loginUser);

// POST /api/auth/google -> Google OAuth Login/Signup
router.post("/google", validate(googleAuthSchema), googleLoginUser);

// POST /api/auth/logout -> Logout
router.post("/logout", logoutUser);

export default router;