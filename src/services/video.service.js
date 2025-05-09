const httpStatus = require("http-status");
const { Video, Reaction } = require("../models");
const ApiError = require("../utils/ApiError");
const { default: mongoose } = require("mongoose");

const createContent = async (data) => {
  const content = await Video.create(data);
  return content;
};

const queryContents = async (filter, options) => {
  const contents = await Video.paginate(filter, options);
  return contents;
};

const getContentById = async (id) => {
  return Video.findById(id);
};

const updateContentById = async (contentId, updateBody) => {
  const content = await getContentById(contentId);
  if (!content) {
    throw new ApiError(httpStatus.NOT_FOUND, "Content not found");
  }
  Object.assign(content, updateBody);
  await content.save();
  return content;
};

const deleteContentById = async (contentId) => {
  const content = await getContentById(contentId);
  if (!content) {
    throw new ApiError(httpStatus.NOT_FOUND, "Content not found");
  }
  await content.remove();
  return content;
};

const reactToVideo = async (userId, contentId) => {
  const existingLike = await Reaction.findOne({
    user: userId,
    video: contentId,
  });

  if (existingLike) {
    await existingLike.remove();
    await Video.findByIdAndUpdate(contentId, { $inc: { likes: -1 } });
    return { liked: false };
  } else {
    await Reaction.create({ user: userId, video: contentId });
    await Video.findByIdAndUpdate(contentId, { $inc: { likes: 1 } });
    return { liked: true };
  }
};

const addViewToVideo = async (contentId) => {
  await Video.findByIdAndUpdate(contentId, { $inc: { views: 1 } });
  return true;
};

const getVideoFeed = async (cursor, userId, search) => {
  const limit = 10;

  const pipeline = [
    ...(cursor ? [{ $match: { _id: { $lt: cursor } } }] : []),

    ...(search
      ? [
          {
            $match: {
              $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $elemMatch: { $regex: search, $options: "i" } } },
              ],
            },
          },
        ]
      : []),

    { $sort: { _id: -1 } },

    { $limit: limit },
  ];

  if (userId) {
    pipeline.push(
      {
        $lookup: {
          from: "reactions", // Ensure the collection name is correct
          let: { videoId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$video", "$$videoId"] } } },
            { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Ensure `user` is matched as ObjectId
          ],
          as: "userLikes",
        },
      },
      {
        $addFields: {
          likedByUser: {
            $cond: {
              if: { $gt: [{ $size: "$userLikes" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      { $unset: "userLikes" }
    );
  }

  // Execute the aggregation pipeline
  const results = await Video.aggregate(pipeline).exec();
  return results;
};

module.exports = {
  createContent,
  queryContents,
  getContentById,
  updateContentById,
  deleteContentById,
  reactToVideo,
  addViewToVideo,
  getVideoFeed,
};
