const Joi = require("joi").extend(require("@joi/date"));
const { objectId } = require("./custom.validation");

const postVideo = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    tags: Joi.array().items(Joi.string()),
    creator: Joi.string().custom(objectId),
    url: Joi.string().uri().required(),
    thumbnailUrl: Joi.string().uri().allow(null, ""),
  }),
};

const updateVideo = {
  params: Joi.object().keys({
    contentId: Joi.string().custom(objectId),
  }),
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(""),
    tags: Joi.array().items(Joi.string()),
  }),
};

const getVideo = {
  params: Joi.object().keys({
    contentId: Joi.string().custom(objectId),
  }),
};

const commentVideo = {
  params: Joi.object().keys({
    contentId: Joi.string().custom(objectId),
  }),
  body: Joi.object({
    content: Joi.string().required(),
  }),
};

module.exports = {
  postVideo,
  updateVideo,
  getVideo,
  commentVideo,
};
