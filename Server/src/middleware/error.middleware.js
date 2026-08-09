// ============================================================
// middleware/error.middleware.js - CENTRAL PRODUCTION ERROR HANDLER
// ============================================================

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || undefined;

  // 1. Prisma Unique Constraint Violation (P2002)
  if (err.code === "P2002") {
    statusCode = 409;
    const targetField = err.meta?.target?.[0] || "field";
    message = `A record with this ${targetField} already exists.`;
  }

  // 2. Prisma Record Not Found (P2025)
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Resource not found in database.";
  }

  // 3. JWT Error Handling
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Authentication failed.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please login again.";
  }

  // 4. Zod Validation Errors
  if (err.name === "ZodError") {
    statusCode = 422;
    message = "Validation Error";
    errors = err.errors?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    // Hide stack trace in production
    stack: isDev ? err.stack : undefined,
  });
};

export default errorHandler;
