import {
  createCommentService,
  getIssueCommentsService,
} from "../services/comment.service.js";

export const getIssueComments = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const comments = await getIssueCommentsService(issueId);

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const issueId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await createCommentService(issueId, userId, content);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
