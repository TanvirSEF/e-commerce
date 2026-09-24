import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const shippingCities = pgTable("shipping_cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(), // Division/State e.g. "Dhaka", "Chattogram"
  country: varchar("country", { length: 100 }).default("Bangladesh").notNull(),
  zoneId: integer("zone_id").default(1).notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).default("60.00").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type ShippingCity = typeof shippingCities.$inferSelect
export type NewShippingCity = typeof shippingCities.$inferInsert
