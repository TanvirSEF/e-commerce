import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core"

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const flashDeals = pgTable("flash_deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  startDate: bigint("start_date", { mode: "number" }).notNull(),
  endDate: bigint("end_date", { mode: "number" }).notNull(),
  status: boolean("status").default(true).notNull(),
  featured: boolean("featured").default(true).notNull(),
  banner: text("banner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
