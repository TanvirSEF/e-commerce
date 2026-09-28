import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const addons = pgTable("addons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  uniqueIdentifier: varchar("unique_identifier", { length: 100 }).notNull().unique(),
  version: varchar("version", { length: 50 }).notNull().default("1.0"),
  activated: boolean("activated").notNull().default(true),
  image: text("image"),
  purchaseCode: varchar("purchase_code", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type AddonRecord = typeof addons.$inferSelect
export type NewAddonRecord = typeof addons.$inferInsert
