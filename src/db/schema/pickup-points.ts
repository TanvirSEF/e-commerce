import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const pickupPoints = pgTable("pickup_points", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  managerName: varchar("manager_name", { length: 255 }),
  pickupStatus: boolean("pickup_status").default(true).notNull(),
  cashOnPickupStatus: boolean("cash_on_pickup_status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type PickupPoint = typeof pickupPoints.$inferSelect
export type NewPickupPoint = typeof pickupPoints.$inferInsert
