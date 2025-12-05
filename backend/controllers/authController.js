import * as authService from "../services/authService.js";
import * as errors from "../utils/errors.js";

/**
 * POST /auth/register - Register a new user.
 * @body {string} username - Username (required)
 * @body {string} password - Password (required)
 */
export async function register(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || username.trim() === "") {
      throw new errors.ValidationError("Username is required");
    }

    if (!password || password.trim() === "") {
      throw new errors.ValidationError("Password is required");
    }

    const result = await authService.register(username, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/login - Authenticate user and return JWT token.
 * @body {string} username - Username (required)
 * @body {string} password - Password (required)
 */
export async function login(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || username.trim() === "") {
      throw new errors.ValidationError("Username is required");
    }

    if (!password || password.trim() === "") {
      throw new errors.ValidationError("Password is required");
    }

    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
