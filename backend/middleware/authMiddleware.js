import dotenv from "dotenv";
dotenv.config();
import * as authUtils from "../utils/authUtils.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = authUtils.verifyJWT(token);
    req.user = decoded;
  } catch {
    return res.status(401).json({ error: "Token expired/invalid" });
  }

  next();
}
