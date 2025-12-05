import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Compare a plain text password against a hash.
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Bcrypt hash to compare against
 * @returns {Promise<boolean>} True if password matches
 */
export async function validatePassword(password, hashedPassword) {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}

/**
 * Generate a JWT token for a user.
 * @param {number} id - User ID
 * @returns {string} Signed JWT token (expires in 24h)
 */
export function generateJWT(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
  return token;
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
export function verifyJWT(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}
