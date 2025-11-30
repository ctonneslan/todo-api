import * as authService from "../services/authService.js";

export async function register(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const result = await authService.register(username, password);
    if (!result) {
      return res.status(409).json({ error: "Username already exists" });
    }
    res.status(201).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}

export async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const result = await authService.login(username, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}
