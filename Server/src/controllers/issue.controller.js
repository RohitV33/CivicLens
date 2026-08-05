// ============================================================
// controllers/issue.controller.js - ISSUE CONTROLLER
//
// Handles HTTP requests for civic issues
// All routes here require the user to be logged in (authMiddleware)
// ============================================================

import {
  getAllIssuesService,
  getIssueByIdService,
  createIssueService,
} from "../services/issue.service.js";

// ---- GET /api/issues ----
// Returns all civic issues (public, no login needed)
export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await getAllIssuesService();

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });

  } catch (error) {
    next(error);
  }
};

// ---- GET /api/issues/:id ----
// Returns a single issue by its ID
// :id in the URL → req.params.id in the code
export const getIssueById = async (req, res, next) => {
  try {
    // Convert the id from string to number (URL params are always strings)
    const issueId = parseInt(req.params.id);

    const issue = await getIssueByIdService(issueId);

    res.status(200).json({
      success: true,
      data: issue,
    });

  } catch (error) {
    next(error);
  }
};

// ---- POST /api/issues ----
// Creates a new issue (must be logged in)
export const createIssue = async (req, res, next) => {
  try {
    // req.user.id = the logged-in user's id (set by authMiddleware)
    const reporterId = req.user.id;

    const issue = await createIssueService(req.body, reporterId);

    res.status(201).json({
      success: true,
      message: "Issue reported successfully!",
      data: issue,
    });

  } catch (error) {
    next(error);
  }
};
