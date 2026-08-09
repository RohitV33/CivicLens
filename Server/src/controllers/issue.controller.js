// ============================================================
// controllers/issue.controller.js - ISSUE CONTROLLER
// ============================================================

import {
  createIssueService,
  getAllIssuesService,
  getMyIssuesService,
  getIssueByIdService,
  updateIssueService,
  deleteIssueService,
} from "../services/issue.service.js";

// ---- POST /api/issues ----
export const createIssue = async (req, res, next) => {
  try {
    const createdById = req.user.id;
    const issue = await createIssueService(req.body, createdById);

    res.status(201).json({
      success: true,
      message: "Issue reported successfully!",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/issues ----
export const getAllIssues = async (req, res, next) => {
  try {
    const result = await getAllIssuesService(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/issues/my ----
export const getMyIssues = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const issues = await getMyIssuesService(userId);

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
export const getIssueById = async (req, res, next) => {
  try {
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

// ---- PATCH /api/issues/:id ----
export const updateIssue = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const issue = await updateIssueService(issueId, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// ---- DELETE /api/issues/:id ----
export const deleteIssue = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const result = await deleteIssueService(issueId, req.user);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
