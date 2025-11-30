import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app.js";
import pool from "./db/config.js";

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}:${PORT}`);
});

function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("HTTP server closed");

    pool.end(() => {
      console.log("Database pool closed");
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
