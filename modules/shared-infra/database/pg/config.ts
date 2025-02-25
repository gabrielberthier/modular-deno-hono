import { defineConfig } from "drizzle-kit";

const root = "../../../..";

export default defineConfig({
  out: `${root}/drizzle`,
  dialect: "postgresql",
  schema: "./schema.ts",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL") ??
      "postgres://postgres:password@db:5432/hono",
  },
});
