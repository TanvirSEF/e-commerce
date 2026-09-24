import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"

export const colors = pgTable("colors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type ColorItem = typeof colors.$inferSelect
