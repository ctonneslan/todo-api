import pool from "../db/config.js";
import * as authUtils from "../utils/authUtils.js";

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
