import prisma from "../lib/prisma.js";

// ---- Get comments for an issue ----
export const getIssueCommentsService = async (issueId) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true, role: true },
      },
    },
  });

  return comments;
};

// ---- Create a comment ----
export const createCommentService = async (issueId, userId, content) => {
  if (isNaN(issueId)) {
    const error = new Error("Invalid issue ID");
    error.statusCode = 400;
    throw error;
  }

  if (!content || !content.trim()) {
    const error = new Error("Comment content cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  if (!issue) {
    const error = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }

  const newComment = await prisma.comment.create({
    data: {
      issueId,
      userId,
      content: content.trim(),
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true, role: true },
      },
    },
  });

  return newComment;
};
