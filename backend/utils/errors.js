/**
 * Base application error class.
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   */
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** 404 Not Found error. */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/** 400 Bad Request error for validation failures. */
export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

/** 401 Unauthorized error for authentication failures. */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/** 409 Conflict error for duplicate resources. */
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}
