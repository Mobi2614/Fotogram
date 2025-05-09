const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { videoService, commentService } = require("../services");

const postVideo = catchAsync(async (req, res) => {
  const payload = { ...req.body, creator: req.user.id };
  const video = await videoService.createContent(payload);
  res.send(video);
});

const getVideos = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["creator"]);
  if (req.user) {
    filter["creator"] = req.user.id;
  }
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await videoService.queryContents(filter, options);
  res.send(result);
});

const deleteVideo = catchAsync(async (req, res) => {
  const video = await videoService.deleteContentById(req.params.contentId);
  res.status(httpStatus.OK).send(video);
});

const updateVideo = catchAsync(async (req, res) => {
  const video = await videoService.updateContentById(
    req.params.contentId,
    req.body
  );

  res.status(httpStatus.OK).send(video);
});

const addReactionToVideo = catchAsync(async (req, res) => {
  const video = await videoService.reactToVideo(
    req.user.id,
    req.params.contentId
  );
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found");
  }
  res.send(video);
});

const addViewToVideo = catchAsync(async (req, res) => {
  const video = await videoService.addViewToVideo(
    req.user.id,
    req.params.contentId
  );
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found");
  }
  res.send(video);
});

const addCommentToVideo = catchAsync(async (req, res) => {
  const payload = {
    content: req.body.content,
    video: req.params.contentId,
    user: req.user.id,
  };
  const comment = await commentService.addComment(payload);
  res.status(httpStatus.OK, comment);
});

const getVideoComments = catchAsync(async (req, res) => {
  let filter = { video: req.params.contentId };
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await commentService.getCommentByVideo(filter, options);
  res.send(result);
});

const getVideoFeed = catchAsync(async (req, res) => {
  const options = pick(req.query, ["search", "cursor"]);

  const cursor = options.cursor ? options.cursor : null;
  const search = options.search;
  const userId = req.user ? req.user.id : null;
  const results = await videoService.getVideoFeed(cursor, userId, search);
  // Get the next cursor
  const lastItem = results[results.length - 1];
  const nextCursor = lastItem ? lastItem._id.toString() : null;

  res.status(200).json({
    status: 200,
    message: "Success",
    videos: results,
    nextCursor,
  });
});

module.exports = {
  postVideo,
  getVideos,
  addReactionToVideo,
  addViewToVideo,
  deleteVideo,
  updateVideo,
  addCommentToVideo,
  getVideoComments,
  getVideoFeed,
};
