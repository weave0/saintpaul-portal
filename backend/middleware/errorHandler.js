const Sentry = require('@sentry/node');

const isSentryEnabled = !!process.env.SENTRY_DSN;
if (isSentryEnabled && !Sentry.isInitialized()) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1
  });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const logger = req.log || (req.app && req.app.locals && req.app.locals.logger);
  if (logger) {
    logger.error({ err }, 'Unhandled error');
  } else {
    console.error(err); // fallback
  }
  if (isSentryEnabled) {
    Sentry.captureException(err);
  }
  if (res.headersSent) return; // delegate to default if headers already sent
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.code || 'InternalError',
    message: status === 500 ? 'Something went wrong.' : err.message,
  });
}

module.exports = { errorHandler };