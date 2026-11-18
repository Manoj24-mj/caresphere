const { error } = require("../utils/response");

/**
 * 404 Not Found Route Handler
 */
function notFoundHandler(req, res) {
  return error(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error("💥 [CareSphere Error]:", err);

  // Prisma Known Request Error handling
  if (err.code && err.code.startsWith("P")) {
    if (err.code === "P2002") {
      const target = err.meta?.target || "Field";
      return error(res, `Unique constraint violation on: ${target}`, 409);
    }
    if (err.code === "P2025") {
      return error(res, "Requested record was not found.", 404);
    }
  }

  // Joi / express-validator schema errors
  if (err.name === "ValidationError") {
    return error(res, "Validation failed for request parameters.", 400, err.errors || err.message);
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" && statusCode === 500
    ? "Internal server error. Please try again later."
    : err.message || "An unexpected error occurred.";

  return error(res, message, statusCode);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
