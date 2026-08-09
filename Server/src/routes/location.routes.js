// ============================================================
// routes/location.routes.js - LOCATION & MAP ROUTES
// ============================================================

import express from "express";
import { getReverseGeocode } from "../controllers/location.controller.js";

const router = express.Router();

// GET /api/location/reverse?lat=28.6692&lng=77.4538
router.get("/reverse", getReverseGeocode);

export default router;
