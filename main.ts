import process from "node:process";
import app from "./modules/shared-infra/application/app.ts";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";

const port = parseInt(process.env.PORT || "3000", 10);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [
        { url: `http://localhost:${port}`, description: "Local Server" },
      ],
    },
  }),
);

app.get(
  "/docs",
  apiReference({
    theme: "saturn",
    spec: { url: "/openapi" },
  }),
);

Deno.serve({ port }, app.fetch);
