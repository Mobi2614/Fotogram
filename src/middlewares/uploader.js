const { BlobServiceClient } = require("@azure/storage-blob");
const multer = require("multer");
const streamifier = require("streamifier");
const config = require("../config/config");

const blobServiceClient = new BlobServiceClient(config.azure.connectionString);

const uploader = () => {
  const multerUpload = multer({ storage: multer.memoryStorage() });

  return multerUpload.array("files", 5);
};

const uploadToAzure = async (files, containerName = "fotogram") => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ publicAccess: "container" });

    const uploadPromises = files.map(async (file) => {
      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadStream(
        streamifier.createReadStream(file.buffer),
        4 * 1024 * 1024, // Chunk size (4MB)
        20, // Parallelism
        {
          blobHTTPHeaders: {
            blobContentType: file.mimetype,
          },
        }
      );

      return { filename: file.originalname, url: blockBlobClient.url };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Azure Blob upload failed:", error);
    throw error;
  }
};

module.exports = { uploader, uploadToAzure };
