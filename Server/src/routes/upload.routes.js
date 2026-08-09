// ============================================================
// routes/upload.routes.js - IMAGE UPLOAD ROUTES
// ============================================================

import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import uploadSingleImage from "../middleware/upload.js";

const router = express.Router();

// POST /api/upload -> Upload single issue image (must be logged in)
router.post("/", authMiddleware, uploadSingleImage, uploadImage);

export default router;
