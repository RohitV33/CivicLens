// ============================================================
// middleware/authorize.middleware.js - ROLE AUTHORIZATION MIDDLEWARE
//
// WHAT IS AUTHORIZATION?
// Authentication = "Who are you?" (handled by auth.middleware.js)
// Authorization  = "Are you ALLOWED to do this?" (handled here)
//
// Example: Only "ADMIN" users can see all users.
//          Regular "USER" cannot.
//
// HOW TO USE IT:
// In your route file, add authorizeRoles("ADMIN") after authMiddleware:
//   router.get("/all", authMiddleware, authorizeRoles("ADMIN"), getUsers);
//
// You can allow multiple roles:
//   authorizeRoles("ADMIN", "MODERATOR")
// ============================================================

const authorizeRoles = (...allowedRoles) => {
  // This returns a middleware function
  return (req, res, next) => {

    // req.user was set by authMiddleware earlier
    const userRole = req.user?.role;

    // Check if the user's role is in the allowed list
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    // User has the right role → let them through
    next();
  };
};

export default authorizeRoles;
