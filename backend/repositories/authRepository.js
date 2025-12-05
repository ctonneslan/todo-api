import pool from "../db/config.js";
import * as authUtils from "../utils/authUtils.js";

/**
 * Create a new user.
 * @param {string} username - Username
 * @param {string} password - Plain text password (will be hashed)
 * @returns {Promise<object|null>} Created user (without password) or null if username exists
 */
export async function register(username, password) {
  const hashedPassword = await authUtils.hashPassword(password);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      return null;
    }
    throw err;
  }
}

/**
 * Validate credentials and return JWT token.
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<{token: string}|null>} JWT token object or null if invalid credentials
 */
export async function login(username, password) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (result.rowCount === 0) {
    return null;
  }

  const user = result.rows[0];
  const check = await authUtils.validatePassword(password, user.password_hash);

  if (check) {
    const token = authUtils.generateJWT(user.id);
    return { token };
  }
  return null;
}
