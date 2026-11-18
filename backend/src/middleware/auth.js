const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "caresphere-dev-secret-key-32chars-min-security-test";

/**
 * Authentication Middleware: Validates Bearer JWT Token
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Authentication required. Please provide a valid Bearer token.", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, email, mobile, cityId }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, "Authentication token has expired. Please log in again.", 401);
    }
    return error(res, "Invalid authentication token.", 401);
  }
}

/**
 * Optional Authentication: Attaches req.user if token is present, continues otherwise
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Ignore invalid token in optional mode
    }
  }
  next();
}

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles Roles permitted to access the route
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, "Authentication required prior to permission check.", 401);
    }

    const normalizedUserRole = String(req.user.role || "").toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => String(r).toUpperCase());

    if (!normalizedAllowed.includes(normalizedUserRole)) {
      return error(
        res,
        `Access denied. Role '${req.user.role}' is not authorized for this action. Required: [${allowedRoles.join(", ")}]`,
        403
      );
    }

    next();
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  authorizeRoles
};
