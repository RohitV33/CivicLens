// ============================================================
// middleware/error.middleware.js - GLOBAL ERROR HANDLER
//
// This is a special Express middleware with 4 parameters: (err, req, res, next)
// Express automatically uses this when you call next(error) from a controller.
//
// Instead of putting try/catch in every single controller,
// you can just throw an error and this function will catch it.
//
// HOW TO USE:
// In any controller, throw an error with a statusCode:
//   const error = new Error("User not found");
//   error.statusCode = 404;
//   throw error;
// ============================================================

export const errorHandler = (err, req, res, next) => {
  // Use the error's statusCode if set, otherwise default to 500 (server error)
  const statusCode = err.statusCode || 500;

  // Use the error message, or a generic message
  const message = err.message || "Something went wrong on the server";

  // In development, also return the error stack trace for debugging
  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development (never in production!)
    stack: isDev ? err.stack : undefined,
  });
};
