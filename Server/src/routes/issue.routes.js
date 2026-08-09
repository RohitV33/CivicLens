// ============================================================
// routes/issue.routes.js - ISSUE ROUTES WITH ZOD VALIDATION
// ============================================================

import express from "express";
import {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "../controllers/issue.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createIssueSchema, updateIssueSchema } from "../validators/issue.validator.js";

const router = express.Router();

// GET /api/issues -> Public list
router.get("/", getAllIssues);

// GET /api/issues/my -> Authenticated user's issues
router.get("/my", authMiddleware, getMyIssues);

// GET /api/issues/:id -> Get single issue
router.get("/:id", getIssueById);

// POST /api/issues -> Report issue with Zod validation
router.post("/", authMiddleware, validate(createIssueSchema), createIssue);

// PATCH /api/issues/:id -> Update issue with validation
router.patch("/:id", authMiddleware, validate(updateIssueSchema), updateIssue);

// DELETE /api/issues/:id -> Delete issue
router.delete("/:id", authMiddleware, deleteIssue);

export default router;