import { drizzle } from "drizzle-orm/node-postgres";
import { users as usersSchema } from "./schema.ts";
import pg from "pg";

// Use pg driver.
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL") ??
      "postgres://postgres:password@localhost:5432/hono",
  }),
  schema: { usersSchema },
});

export type PgDb = typeof db;
