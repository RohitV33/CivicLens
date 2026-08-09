// ============================================================
// services/admin.service.js - ADMIN BUSINESS LOGIC & TRANSACTIONS
// ============================================================

import prisma from "../lib/prisma.js";

// ---- Admin List Issues with Advanced Filters ----
export const getAdminIssuesService = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  const where = {};

  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.assignedToId) where.assignedToId = parseInt(query.assignedToId);

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
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
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

// ---- Update Issue Status (Prisma Transaction) ----
export const updateIssueStatusService = async (issueId, newStatus, comment, adminId) => {
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

  const oldStatus = existingIssue.status;

  // PRISMA TRANSACTION: Atomic update of Issue + History + Notification
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update issue status
    const updatedIssue = await tx.issue.update({
      where: { id: issueId },
      data: { status: newStatus },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    // 2. Insert audit log history
    await tx.issueHistory.create({
      data: {
        issueId,
        changedById: adminId,
        oldStatus,
        newStatus,
        comment: comment || `Status updated from ${oldStatus} to ${newStatus}`,
      },
    });

    // 3. Create notification for citizen
    await tx.notification.create({
      data: {
        userId: existingIssue.createdById,
        issueId,
        message: `Your issue #${issueId} (${existingIssue.title}) status changed to ${newStatus}.`,
      },
    });

    return updatedIssue;
  });

  return result;
};

// ---- Update Issue Priority (Admin Override) ----
export const updateIssuePriorityService = async (issueId, newPriority, adminId) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  const issue = await prisma.issue.update({
    where: { id: issueId },
    data: { priority: newPriority },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  // Notify creator about priority change
  await prisma.notification.create({
    data: {
      userId: issue.createdById,
      issueId,
      message: `Priority for your issue #${issueId} was updated to ${newPriority}.`,
    },
  });

  return issue;
};

// ---- Assign Issue to Admin/Officer ----
export const assignIssueService = async (issueId, assignedToId, adminId) => {
  if (isNaN(issueId) || isNaN(assignedToId)) {
    const error = new Error("Invalid issue or assignee ID");
    error.statusCode = 400;
    throw error;
  }

  const assignee = await prisma.user.findUnique({
    where: { id: assignedToId },
  });

  if (!assignee) {
    const error = new Error("Assignee user not found");
    error.statusCode = 404;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    const issue = await tx.issue.update({
      where: { id: issueId },
      data: {
        assignedToId,
        status: "ASSIGNED",
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await tx.issueHistory.create({
      data: {
        issueId,
        changedById: adminId,
        oldStatus: issue.status,
        newStatus: "ASSIGNED",
        comment: `Assigned to ${assignee.name} (${assignee.email})`,
      },
    });

    await tx.notification.create({
      data: {
        userId: issue.createdById,
        issueId,
        message: `Your issue #${issueId} has been assigned to ${assignee.name}.`,
      },
    });

    return issue;
  });

  return result;
};

// ---- Admin Analytics Dashboard ----
export const getAdminAnalyticsService = async () => {
  const [
    totalIssues,
    pending,
    reviewing,
    assigned,
    inProgress,
    resolved,
    rejected,
    highPriority,
    criticalPriority,
    categoryCounts,
  ] = await Promise.all([
    prisma.issue.count(),
    prisma.issue.count({ where: { status: "PENDING" } }),
    prisma.issue.count({ where: { status: "REVIEWING" } }),
    prisma.issue.count({ where: { status: "ASSIGNED" } }),
    prisma.issue.count({ where: { status: "IN_PROGRESS" } }),
    prisma.issue.count({ where: { status: "RESOLVED" } }),
    prisma.issue.count({ where: { status: "REJECTED" } }),
    prisma.issue.count({ where: { priority: "HIGH" } }),
    prisma.issue.count({ where: { priority: "CRITICAL" } }),
    prisma.issue.groupBy({
      by: ["category"],
      _count: { category: true },
    }),
  ]);

  const resolutionRate = totalIssues > 0 ? ((resolved / totalIssues) * 100).toFixed(1) : 0;

  return {
    totalIssues,
    statusBreakdown: {
      pending,
      reviewing,
      assigned,
      inProgress,
      resolved,
      rejected,
    },
    priorityBreakdown: {
      high: highPriority,
      critical: criticalPriority,
    },
    categoryBreakdown: categoryCounts.map((c) => ({
      category: c.category,
      count: c._count.category,
    })),
    resolutionRate: `${resolutionRate}%`,
  };
};
