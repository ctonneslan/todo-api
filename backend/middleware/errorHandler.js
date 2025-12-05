/**
 * Express error handling middleware.
 * Logs error stack and returns appropriate status/message.
 * Hides internal error details for 500 errors.
 */
export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.status || 500;

  const message =
    status === 500
      ? "Internal server error"
      : err.message || "Something went wrong";

  res.status(status).json({ error: message });
}
