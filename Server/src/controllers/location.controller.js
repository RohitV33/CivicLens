// ============================================================
// controllers/location.controller.js - LOCATION CONTROLLER
// ============================================================

import { reverseGeocodeService } from "../services/location.service.js";

export const getReverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      const error = new Error("Query parameters 'lat' and 'lng' are required");
      error.statusCode = 400;
      throw error;
    }

    const result = await reverseGeocodeService(lat, lng);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
