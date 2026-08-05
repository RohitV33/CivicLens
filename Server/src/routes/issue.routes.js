// ============================================================
// routes/issue.routes.js - ISSUE ROUTES
//
// GET /api/issues      → Public (anyone can see issues)
// GET /api/issues/:id  → Public
// POST /api/issues     → Protected (must be logged in to report an issue)
// ============================================================

import express from "express";
import {
  getAllIssues,
  getIssueById,
  createIssue,
} from "../controllers/issue.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/issues         → Get all civic issues (public)
router.get("/", getAllIssues);

// GET /api/issues/:id     → Get a single issue by ID (public)
// :id is a URL parameter → accessed as req.params.id
router.get("/:id", getIssueById);

// POST /api/issues        → Report a new issue (must be logged in)
router.post("/", authMiddleware, createIssue);

export default router;