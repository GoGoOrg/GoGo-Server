// errorHandler.js
const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
