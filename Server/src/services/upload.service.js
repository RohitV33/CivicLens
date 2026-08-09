// ============================================================
// services/upload.service.js - CLOUDINARY UPLOAD SERVICE LAYER
// ============================================================

import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadToCloudinaryService = async (fileBuffer, mimetype, folder = "civiclens/issues") => {
  if (!fileBuffer) {
    const error = new Error("No file buffer provided for upload");
    error.statusCode = 400;
    throw error;
  }

  return new Promise((resolve, reject) => {
    // Check if real Cloudinary keys are configured
    const isConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "demo" &&
      process.env.CLOUDINARY_API_KEY !== "1234567890";

    if (!isConfigured) {
      // Fallback Data URI for local dev when real API keys aren't added yet
      const base64Data = fileBuffer.toString("base64");
      const dataUri = `data:${mimetype || "image/png"};base64,${base64Data}`;
      return resolve({
        url: dataUri,
        public_id: `dev_${Date.now()}`,
        format: mimetype ? mimetype.split("/")[1] : "png",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      }
    );

    // Convert Buffer to Stream
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};
