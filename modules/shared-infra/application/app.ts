import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRoutes } from "../../user/presentation/routes/userRoutes.ts";
import { logger } from "hono/logger";
import process from "node:process";

const app = new Hono();

// Cors setup
app.use("*", cors());

// Logger
app.use(logger());
// Your own routes here
app.route("/users", userRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => {
  // Return a 200 status with a simple message or data
  return c.json({ status: "ok", uptime: process.uptime() });
});

export default app;
