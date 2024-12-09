const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?._id
  });

  // Send error response
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
}

module.exports = errorHandler; 