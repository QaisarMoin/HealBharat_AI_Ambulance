const logger = require("../utils/logger");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred:", err);

  // Default error
  let error = {
    success: false,
    message: err.message || "Server Error",
    error: {},
  };

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.error = { path: err.path, value: err.value };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.error = { code: err.code, key: Object.keys(err.keyValue) };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error.message = "Invalid input data";
    error.error = Object.values(err.errors).map((val) => val.message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
  }

  // Request validation errors
  if (err.name === "ValidationError" && err.isJoi) {
    error.message = "Validation failed";
    error.error = err.details.map((detail) => detail.message);
  }

  // Log error details
  logger.error(`Error details:`, {
    message: error.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Send error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    ...error,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
