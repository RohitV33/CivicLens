// ============================================================
// middleware/authorize.middleware.js - ROLE AUTHORIZATION MIDDLEWARE
//
// WHAT IS AUTHORIZATION?
// Authentication = "Who are you?" (handled by auth.middleware.js)
// Authorization  = "Are you ALLOWED to do this?" (handled here)
//
// Example: Only "ADMIN" users can access admin routes.
//          Regular "USER" receives 403 Forbidden.
//
// HOW TO USE IT:
// In your route file, add authorize("ADMIN") after authMiddleware:
//   router.get("/all", authMiddleware, authorize("ADMIN"), getAllUsers);
//
// Support multiple roles:
//   authorize("ADMIN", "USER")
// ============================================================

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Check if req.user exists (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please authenticate first.",
      });
    }

    const userRole = req.user.role;

    // 2. Check if the user's role is included in allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Access denied for role '${userRole}'. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    // 3. User has authorized role → proceed to controller
    next();
  };
};

export const authorizeRoles = authorize;
export default authorize;

