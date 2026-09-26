import {
  pgTable,
  serial,
  varchar,
  numeric,
  boolean,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core"

export const deliveryBoys = pgTable("delivery_boys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }).notNull(),
  avatar: varchar("avatar", { length: 500 }),
  zoneId: integer("zone_id").default(1).notNull(),
  zoneName: varchar("zone_name", { length: 100 }).default("Default Zone").notNull(),
  status: boolean("status").default(true).notNull(), // true = active, false = banned
  totalEarnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalCollection: numeric("total_collection", { precision: 10, scale: 2 }).default("0.00").notNull(),
  currentPendingDeliveries: integer("current_pending_deliveries").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const deliveryCollections = pgTable("delivery_collections", {
  id: serial("id").primaryKey(),
  deliveryBoyId: integer("delivery_boy_id").notNull(),
  deliveryBoyName: varchar("delivery_boy_name", { length: 150 }).notNull(),
  orderCode: varchar("order_code", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  collectionDate: timestamp("collection_date").defaultNow().notNull(),
})

export const deliveryPayouts = pgTable("delivery_payouts", {
  id: serial("id").primaryKey(),
  deliveryBoyId: integer("delivery_boy_id").notNull(),
  deliveryBoyName: varchar("delivery_boy_name", { length: 150 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("Cash").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
})

export const deliveryCancelRequests = pgTable("delivery_cancel_requests", {
  id: serial("id").primaryKey(),
  deliveryBoyId: integer("delivery_boy_id").notNull(),
  deliveryBoyName: varchar("delivery_boy_name", { length: 150 }).notNull(),
  orderCode: varchar("order_code", { length: 50 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type DeliveryBoy = typeof deliveryBoys.$inferSelect
export type NewDeliveryBoy = typeof deliveryBoys.$inferInsert
export type DeliveryCollection = typeof deliveryCollections.$inferSelect
export type DeliveryPayout = typeof deliveryPayouts.$inferSelect
export type DeliveryCancelRequest = typeof deliveryCancelRequests.$inferSelect
