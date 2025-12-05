import * as authRepository from "../repositories/authRepository.js";
import * as errors from "../utils/errors.js";

/**
 * Register a new user.
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<object>} Created user (without password)
 * @throws {ConflictError} If username already exists
 */
export async function register(username, password) {
  const result = await authRepository.register(username, password);
  if (!result) throw new errors.ConflictError("Username already exists");
  return result;
}

/**
 * Authenticate user and return JWT token.
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<{token: string}>} JWT token object
 * @throws {UnauthorizedError} If credentials are invalid
 */
export async function login(username, password) {
  const result = await authRepository.login(username, password);
  if (!result)
    throw new errors.UnauthorizedError("Invalid username or password");
  return result;
}
