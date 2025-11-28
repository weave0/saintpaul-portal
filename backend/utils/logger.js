const pino = require('pino');

/**
 * Structured logger for backend
 * Use throughout the application for consistent, queryable logs
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Redact sensitive fields
  redact: {
    paths: ['req.headers.authorization', 'password', 'token'],
    remove: true,
  },
});

/**
 * Create child logger with context
 * @param {Object} bindings - Context to bind (userId, requestId, etc.)
 * @returns {pino.Logger} Child logger
 */
logger.withContext = (bindings) => logger.child(bindings);

/**
 * Log API request with timing
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {number} duration - Request duration in ms
 */
logger.logRequest = (req, res, duration) => {
  logger.info({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  }, 'HTTP request');
};

/**
 * Log error with full context
 * @param {Error} err - Error object
 * @param {Object} context - Additional context
 */
logger.logError = (err, context = {}) => {
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    ...context,
  }, 'Error occurred');
};

module.exports = logger;
