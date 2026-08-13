// ============================================================
// controllers/ai.controller.js - AI CONTROLLER
// ============================================================

import {
  analyzeIssueImageService,
  detectDuplicateIssueService,
  classifyWasteService,
} from "../services/ai.service.js";

// POST /api/ai/analyze
export const analyzeIssueImage = async (req, res, next) => {
  try {
    const { imageUrl, title, description, yoloResult } = req.body;

    const result = await analyzeIssueImageService({ imageUrl, title, description, yoloResult });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/classify-waste
export const classifyWaste = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      const error = new Error("An image file is required for AI waste classification");
      error.statusCode = 400;
      throw error;
    }

    const result = await classifyWasteService(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/check-duplicate
export const checkDuplicateIssue = async (req, res, next) => {
  try {
    const { latitude, longitude, category, radiusInKm } = req.body;

    if (!latitude || !longitude) {
      const error = new Error("Latitude and longitude coordinates are required");
      error.statusCode = 400;
      throw error;
    }

    const result = await detectDuplicateIssueService(
      latitude,
      longitude,
      category,
      radiusInKm ? parseFloat(radiusInKm) : 0.3
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
