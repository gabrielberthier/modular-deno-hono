// index.ts

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db.ts";

await migrate(db, { migrationsFolder: "drizzle" });
