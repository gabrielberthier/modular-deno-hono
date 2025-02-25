import { defineConfig } from "drizzle-kit";
import { dirname, join } from "node:path";



export default defineConfig({
  out: `./drizzle`,
  dialect: "postgresql",
  schema: "./modules/shared-infra/database/pg/schema.ts",
  dbCredentials: {
    url:
      Deno.env.get("DATABASE_URL") ??
      "postgres://postgres:password@localhost:5432/hono",
  },
});
