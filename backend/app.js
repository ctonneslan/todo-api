import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import todosRoutes from "./routes/todosRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import pool from "./db/config.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  // Endpoints
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Todo API" });
  });

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok", message: "connected" });
    } catch (err) {
      res.status(503).json({ status: "error", message: "disconnected" });
    }
  });

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/todos", todosRoutes);
  app.use("/api/categories", categoriesRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
  });

  app.use(errorHandler);

  return app;
}
