// ============================================================
// services/location.service.js - OPENSTREETMAP REVERSE GEOCODING
// ============================================================

export const reverseGeocodeService = async (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    const error = new Error("Invalid latitude or longitude coordinates");
    error.statusCode = 400;
    throw error;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CivicLens-AI/1.0 (contact@civiclens.com)",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const address = data.display_name || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;

    return {
      address,
      latitude: lat,
      longitude: lng,
      rawDetails: data.address || {},
    };
  } catch (err) {
    // Fallback if network fails
    return {
      address: `Location near ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
      latitude: lat,
      longitude: lng,
      rawDetails: {},
    };
  }
};
