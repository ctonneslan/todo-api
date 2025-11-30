import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function validatePassword(password, hashedPassword) {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}

export function generateJWT(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
  return token;
}

export function verifyJWT(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}
