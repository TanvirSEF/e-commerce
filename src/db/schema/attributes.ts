import {
  pgTable,
  serial,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const attributes = pgTable("attributes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  values: jsonb("values").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Attribute = typeof attributes.$inferSelect
export type NewAttribute = typeof attributes.$inferInsert
