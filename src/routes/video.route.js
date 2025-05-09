const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { videoValidations } = require("../validations");
const { VideoController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .get(auth("creator"), VideoController.getVideos)
  .post(
    auth("creator"),
    validate(videoValidations.postVideo),
    VideoController.postVideo
  );

router
  .route("/:contentId")
  .delete(
    auth("creator"),
    validate(videoValidations.getVideo),
    VideoController.deleteVideo
  )
  .put(
    auth("creator"),
    validate(videoValidations.getVideo),
    VideoController.updateVideo
  );

router
  .route("/:contentId/like")
  .get(
    auth("consumer", "creator"),
    validate(videoValidations.getVideo),
    VideoController.addReactionToVideo
  );

router
  .route("/:contentId/view")
  .get(
    auth("consumer", "creator"),
    validate(videoValidations.getVideo),
    VideoController.addViewToVideo
  );

router
  .route("/:contentId/comment")
  .post(
    auth("consumer"),
    validate(videoValidations.commentVideo),
    VideoController.addCommentToVideo
  )
  .get(
    auth("consumer"),
    validate(videoValidations.getVideo),
    VideoController.getVideoComments
  );

router
  .route("/feed")
  .get(auth("consumer", "public"), VideoController.getVideoFeed);

module.exports = router;
