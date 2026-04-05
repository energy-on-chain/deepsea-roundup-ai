/**
 * Centralized error handling middleware.
 *
 * asyncHandler(fn) — wraps async route handlers so uncaught promise rejections
 * reach Express's error middleware instead of crashing the process.
 *
 * errorHandler — 4-argument Express error middleware. Logs the error and returns
 * a structured JSON response. Includes stack trace in non-production environments.
 */

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} — ${status}: ${err.message}`);
  if (err.stack && process.env.REACT_APP_NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.REACT_APP_NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { asyncHandler, errorHandler };
