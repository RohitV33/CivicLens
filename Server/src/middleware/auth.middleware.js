// ============================================================
// middleware/auth.middleware.js - AUTHENTICATION MIDDLEWARE
//
// WHAT IS MIDDLEWARE?
// Middleware is a function that runs BETWEEN the request arriving
// and your controller handling it. Think of it like a security guard.
//
// THIS middleware checks: "Does this user have a valid JWT token?"
// If YES  → call next() to let them through to the controller
// If NO   → send 401 Unauthorized error and stop
//
// HOW DOES IT WORK?
// The client sends: Authorization: Bearer <token>
// We extract the token, verify it, and attach the user data to req.user
// ============================================================

import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Get the Authorization header from the request
    // Example header: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;

    // Step 2: Check if the header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first.",
      });
    }

    // Step 3: Check the format is "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token format is wrong. Use: Bearer <token>",
      });
    }

    // Step 4: Extract just the token part (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    // Step 5: Verify the token using our secret key
    // If it's invalid or expired, jwt.verify() will throw an error
    const decoded = verifyToken(token);

    // Step 6: Attach the decoded user info to req.user
    // Now any controller can access req.user.id, req.user.role, etc.
    req.user = decoded;

    // Step 7: Continue to the next middleware or controller
    next();

  } catch (error) {
    // Token was invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default authMiddleware;