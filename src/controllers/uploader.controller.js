const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { uploadToAzure } = require("../middlewares/uploader");

const uploadFiles = catchAsync(async (req, res) => {
  const files = req.files;
  if (!files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Files uploading failed");
  }
  const uploadedFiles = await uploadToAzure(files);

  res.status(httpStatus.OK).send(uploadedFiles);
});

module.exports = {
  uploadFiles,
};
