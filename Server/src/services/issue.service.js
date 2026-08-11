// ============================================================
// services/issue.service.js - ISSUE BUSINESS LOGIC
// ============================================================

import prisma from "../lib/prisma.js";
import { analyzeIssueImageService } from "./ai.service.js";

// ---- Create a new civic issue ----
export const createIssueService = async (issueData, createdById) => {
  const {
    title,
    description,
    category,
    priority,
    imageUrl,
    latitude,
    longitude,
    location,
    address,
    aiClassification,
    aiConfidence,
  } = issueData;

  if (!title || !description) {
    const error = new Error("Title and description are required");
    error.statusCode = 400;
    throw error;
  }

  // Parse numeric coordinates safely
  const parsedLat = latitude ? parseFloat(latitude) : null;
  const parsedLng = longitude ? parseFloat(longitude) : null;

  if (latitude && isNaN(parsedLat)) {
    const error = new Error("Latitude must be a valid number");
    error.statusCode = 400;
    throw error;
  }

  if (longitude && isNaN(parsedLng)) {
    const error = new Error("Longitude must be a valid number");
    error.statusCode = 400;
    throw error;
  }

  // Run AI analysis to automatically classify and suggest priority if missing
  const aiAnalysis = await analyzeIssueImageService({
    imageUrl,
    title,
    description,
  });

  const finalCategory = category && category !== "OTHER" ? category : aiAnalysis.category;
  const finalPriority = priority || aiAnalysis.priority;
  const finalAiClassification = aiClassification || aiAnalysis.aiClassification;
  const finalAiConfidence = aiConfidence ? parseFloat(aiConfidence) : aiAnalysis.confidence;

  // Use a transaction to create issue & initial history record
  const result = await prisma.$transaction(async (tx) => {
    const issue = await tx.issue.create({
      data: {
        title,
        description,
        category: finalCategory,
        priority: finalPriority,
        imageUrl: imageUrl || null,
        latitude: parsedLat,
        longitude: parsedLng,
        address: address || location || null,
        aiClassification: finalAiClassification,
        aiConfidence: finalAiConfidence,
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create initial audit history record
    await tx.issueHistory.create({
      data: {
        issueId: issue.id,
        changedById: createdById,
        newStatus: "PENDING",
        comment: `Issue reported by citizen. AI auto-classified as ${finalCategory} (${finalAiConfidence}% confidence).`,
      },
    });

    return issue;
  });

  return result;
};

// ---- Get all public issues with pagination & filters ----
export const getAllIssuesService = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  const where = {};

  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { address: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.issue.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.issue.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

// ---- Get issues created by logged-in user ----
export const getMyIssuesService = async (userId) => {
  const issues = await prisma.issue.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return issues;
};

// ---- Get single issue by ID ----
export const getIssueByIdService = async (issueId) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID. Must be an integer");
    error.statusCode = 400;
    throw error;
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      histories: {
        orderBy: { createdAt: "asc" },
        include: {
          changedBy: {
            select: { id: true, name: true, role: true },
          },
        },
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

// ---- Update an issue ----
export const updateIssueService = async (issueId, updateData, user) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  const existingIssue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!existingIssue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  // Only owner or ADMIN can update
  if (existingIssue.createdById !== user.id && user.role !== "ADMIN") {
    const error = new Error("Forbidden. You can only update your own issues");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ["title", "description", "category", "address", "imageUrl"];
  const dataToUpdate = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  });

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: dataToUpdate,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedIssue;
};

// ---- Delete/Reject issue ----
export const deleteIssueService = async (issueId, user) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  const existingIssue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!existingIssue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  if (existingIssue.createdById !== user.id && user.role !== "ADMIN") {
    const error = new Error("Forbidden. You can only delete your own issues");
    error.statusCode = 403;
    throw error;
  }

  await prisma.issue.delete({
    where: { id: issueId },
  });

  return { message: "Issue deleted successfully" };
};

// ---- Toggle Upvote / Endorse Issue ----
export const toggleUpvoteIssueService = async (issueId, userId) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  const existingIssue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!existingIssue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      userId_issueId: {
        userId,
        issueId,
      },
    },
  });

  let hasUpvoted = false;
  let newCount = existingIssue.upvoteCount || 0;

  if (existingUpvote) {
    // Remove upvote
    await prisma.$transaction([
      prisma.upvote.delete({
        where: { id: existingUpvote.id },
      }),
      prisma.issue.update({
        where: { id: issueId },
        data: { upvoteCount: { decrement: 1 } },
      }),
    ]);
    hasUpvoted = false;
    newCount = Math.max(0, newCount - 1);
  } else {
    // Add upvote
    await prisma.$transaction([
      prisma.upvote.create({
        data: { userId, issueId },
      }),
      prisma.issue.update({
        where: { id: issueId },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);
    hasUpvoted = true;
    newCount = newCount + 1;
  }

  return {
    issueId,
    upvoteCount: newCount,
    hasUpvoted,
    message: hasUpvoted ? "Upvoted issue!" : "Removed upvote",
  };
};

