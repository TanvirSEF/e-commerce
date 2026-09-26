import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  phoneCode: varchar("phone_code", { length: 20 }),
  zoneId: integer("zone_id").default(0),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Country = typeof countries.$inferSelect
export type NewCountry = typeof countries.$inferInsert
export type State = typeof states.$inferSelect
export type NewState = typeof states.$inferInsert
export type Zone = typeof zones.$inferSelect
export type NewZone = typeof zones.$inferInsert
