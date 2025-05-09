const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON } = require("./plugins");
const reactionSchema = mongoose.Schema(
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
    like: {
      type: Boolean,
      default: true,
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
reactionSchema.plugin(toJSON);

/**
 * @typedef User
 */
const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
