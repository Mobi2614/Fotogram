const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON } = require("./plugins");
const tokenTypes = require("../config/tokens");
const commentSchema = mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);

/**
 * @typedef User
 */
const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
