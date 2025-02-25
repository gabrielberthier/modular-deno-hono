import { defineConfig } from "drizzle-kit";
import { dirname, join } from "node:path";

const root = "../../../..";

export default defineConfig({
  out: `${root}/drizzle`,
  dialect: "postgresql",
  schema: "./schema.ts",
  dbCredentials: {
    url:
      Deno.env.get("DATABASE_URL") ??
      "postgres://postgres:password@localhost:5432/hono",
  },
});
