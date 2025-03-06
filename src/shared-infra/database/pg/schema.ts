import { pgTable } from "drizzle-orm/pg-core/table";
import { serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  username: varchar().notNull(),
  email: varchar().notNull().unique(),
  uuid: uuid().notNull().defaultRandom(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
