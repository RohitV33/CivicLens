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
  toggleUpvoteIssue,
} from "../controllers/issue.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createIssueSchema, updateIssueSchema } from "../validators/issue.validator.js";

import { getIssueComments, createComment } from "../controllers/comment.controller.js";

const router = express.Router();

// GET /api/issues -> Public list
router.get("/", getAllIssues);

// GET /api/issues/my -> Authenticated user's issues
router.get("/my", authMiddleware, getMyIssues);

// GET /api/issues/:id -> Get single issue
router.get("/:id", getIssueById);

// GET /api/issues/:id/comments -> Get comments for issue
router.get("/:id/comments", getIssueComments);

// POST /api/issues -> Report issue with Zod validation
router.post("/", authMiddleware, validate(createIssueSchema), createIssue);

// POST /api/issues/:id/upvote -> Toggle upvote / endorse issue
router.post("/:id/upvote", authMiddleware, toggleUpvoteIssue);

// POST /api/issues/:id/comments -> Add comment to issue
router.post("/:id/comments", authMiddleware, createComment);

// PATCH /api/issues/:id -> Update issue with validation
router.patch("/:id", authMiddleware, validate(updateIssueSchema), updateIssue);

// DELETE /api/issues/:id -> Delete issue
router.delete("/:id", authMiddleware, deleteIssue);

export default router;