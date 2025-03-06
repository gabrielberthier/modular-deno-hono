import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: `./drizzle`,
  dialect: "postgresql",
  schema: "./src/shared-infra/database/pg/schema.ts",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL") ??
      "postgres://postgres:password@db:5432/hono",
  },
});
