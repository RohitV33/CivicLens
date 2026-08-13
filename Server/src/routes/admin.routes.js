// ============================================================
// routes/admin.routes.js - PROTECTED ADMIN ROUTES WITH ZOD VALIDATION
// ============================================================

import express from "express";
import {
  getAdminIssues,
  updateIssueStatus,
  updateIssuePriority,
  assignIssue,
  getAdminAnalytics,
} from "../controllers/admin.controller.js";
import { deleteIssue } from "../controllers/issue.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  updateStatusSchema,
  updatePrioritySchema,
  assignIssueSchema,
} from "../validators/issue.validator.js";

const router = express.Router();

// Protected for ADMIN only
router.use(authMiddleware, authorize("ADMIN"));

router.get("/issues", getAdminIssues);
router.patch("/issues/:id/status", validate(updateStatusSchema), updateIssueStatus);
router.patch("/issues/:id/priority", validate(updatePrioritySchema), updateIssuePriority);
router.patch("/issues/:id/assign", validate(assignIssueSchema), assignIssue);
router.delete("/issues/:id", deleteIssue);
router.get("/analytics", getAdminAnalytics);

export default router;
