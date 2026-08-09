// ============================================================
// controllers/upload.controller.js - IMAGE UPLOAD CONTROLLER
// ============================================================

import { uploadToCloudinaryService } from "../services/upload.service.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Please select an image file to upload");
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadToCloudinaryService(
      req.file.buffer,
      req.file.mimetype,
      "civiclens/reports"
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.url,
        publicId: result.public_id,
        format: result.format,
      },
    });
  } catch (error) {
    next(error);
  }
};
