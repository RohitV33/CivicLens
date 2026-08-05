// ============================================================
// services/issue.service.js - ISSUE BUSINESS LOGIC
//
// Handles all the database operations for civic issues
// ============================================================

import prisma from "../lib/prisma.js";

// ---- Get all issues from database ----
export const getAllIssuesService = async () => {
  const issues = await prisma.issue.findMany({
    // Also include the user who reported it
    include: {
      reporter: {
        select: { id: true, name: true, email: true },
      },
    },
    // Show newest issues first
    orderBy: { createdAt: "desc" },
  });

  return issues;
};

// ---- Get a single issue by its ID ----
export const getIssueByIdService = async (issueId) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      reporter: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!issue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  return issue;
};

// ---- Create a new issue ----
export const createIssueService = async (issueData, reporterId) => {
  const { title, description, location } = issueData;

  // Validate required fields manually (simple version)
  if (!title || !description) {
    const error = new Error("Title and description are required");
    error.statusCode = 400;
    throw error;
  }

  const issue = await prisma.issue.create({
    data: {
      title,
      description,
      location: location || null,
      reporterId, // the logged-in user's id (from req.user.id)
    },
  });

  return issue;
};
