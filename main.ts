import { Hono } from "hono";
import { cors } from "hono/cors";
import process from "node:process";
import { userRoutes } from "./modules/user/presentation/routes/userRoutes.ts";
import { logger } from "hono/logger";
import { apiReference } from '@scalar/hono-api-reference'

const app = new Hono();
const port = parseInt(process.env.PORT || "3000", 10);

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

import { openAPISpecs } from "hono-openapi";

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [{ url: `http://localhost:${port}`, description: "Local Server" }],
    },
  })
);

app.get(
  "/docs",
  apiReference({
    theme: "saturn",
    spec: { url: "/openapi" },
  })
);

Deno.serve({ port }, app.fetch);
