const express = require("express");
const auth = require("../middlewares/auth");
const { UploaderController } = require("../controllers");
const { uploader } = require("../middlewares/uploader");

const router = express.Router();
router.route("/").post(uploader(), UploaderController.uploadFiles);

module.exports = router;
