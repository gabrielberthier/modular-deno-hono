// index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db.ts";
import config from "./config.ts";

await migrate(db, { migrationsFolder: "drizzle" });
