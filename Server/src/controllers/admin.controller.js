// ============================================================
// controllers/admin.controller.js - ADMIN CONTROLLER
// ============================================================

import {
  getAdminIssuesService,
  updateIssueStatusService,
  updateIssuePriorityService,
  assignIssueService,
  getAdminAnalyticsService,
} from "../services/admin.service.js";

// ---- GET /api/admin/issues ----
export const getAdminIssues = async (req, res, next) => {
  try {
    const result = await getAdminIssuesService(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ---- PATCH /api/admin/issues/:id/status ----
export const updateIssueStatus = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const { status, comment, resolvedImageUrl, resolvedComment } = req.body;
    const adminId = req.user.id;

    if (!status) {
      const error = new Error("Status field is required");
      error.statusCode = 400;
      throw error;
    }

    const issue = await updateIssueStatusService(
      issueId,
      status,
      comment,
      adminId,
      { resolvedImageUrl, resolvedComment }
    );

    res.status(200).json({
      success: true,
      message: `Issue status updated to ${status} successfully`,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};


// ---- PATCH /api/admin/issues/:id/priority ----
export const updateIssuePriority = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const { priority } = req.body;
    const adminId = req.user.id;

    if (!priority) {
      const error = new Error("Priority field is required");
      error.statusCode = 400;
      throw error;
    }

    const issue = await updateIssuePriorityService(issueId, priority, adminId);

    res.status(200).json({
      success: true,
      message: `Issue priority updated to ${priority} successfully`,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// ---- PATCH /api/admin/issues/:id/assign ----
export const assignIssue = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const { assignedToId } = req.body;
    const adminId = req.user.id;

    if (!assignedToId) {
      const error = new Error("assignedToId is required");
      error.statusCode = 400;
      throw error;
    }

    const issue = await assignIssueService(issueId, parseInt(assignedToId), adminId);

    res.status(200).json({
      success: true,
      message: "Issue assigned successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/admin/analytics ----
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const analytics = await getAdminAnalyticsService();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
