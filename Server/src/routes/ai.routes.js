// ============================================================
// routes/ai.routes.js - AI ROUTES
// ============================================================

import express from "express";
import { analyzeIssueImage, checkDuplicateIssue, classifyWaste } from "../controllers/ai.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = express.Router();

// POST /api/ai/analyze -> Run computer vision classification on issue details
router.post("/analyze", authMiddleware, analyzeIssueImage);

// POST /api/ai/classify-waste -> Run YOLOv8 waste classification microservice
router.post("/classify-waste", authMiddleware, uploadSingleImage, classifyWaste);

// POST /api/ai/check-duplicate -> Run Haversine duplicate location check
router.post("/check-duplicate", authMiddleware, checkDuplicateIssue);

export default router;
