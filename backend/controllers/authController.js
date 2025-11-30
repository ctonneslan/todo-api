import * as authService from "../services/authService.js";
import * as errors from "../utils/errors.js";

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
    if (!result) {
      throw new errors.ConflictError("Username already exists");
    }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

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
    if (!result) {
      throw new errors.UnauthorizedError("Invalid username or password");
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
