const httpStatus = require("http-status");
const { Comment } = require("../models");
const ApiError = require("../utils/ApiError");

const addComment = async (data) => {
  const comment = await Comment.create(data);
  if (!comment) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error while creating comment"
    );
  }
  return comment;
};

const getCommentByVideo = async (filter, options) => {
  const comments = await Comment.paginate(filter, options);
  return comments;
};

const getCommentById = async (id) => {
  return Comment.findById(id);
};

const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Content not found");
  }
  await comment.remove();
  return comment;
};

module.exports = {
  addComment,
  getCommentByVideo,
  deleteCommentById,
};
