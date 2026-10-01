import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  text,
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

export const shippingAreas = pgTable("shipping_areas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull().default("Dhaka Division"),
  country: varchar("country", { length: 100 }).notNull().default("Bangladesh"),
  cityId: integer("city_id"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type ShippingArea = typeof shippingAreas.$inferSelect
export type NewShippingArea = typeof shippingAreas.$inferInsert

export const pickupAddresses = pgTable("pickup_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  courierType: varchar("courier_type", { length: 100 }).notNull().default("internal"), // 'shiprocket' | 'pathao' | 'redx' | 'steadfast' | 'internal'
  addressNickname: varchar("address_nickname", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: varchar("address", { length: 500 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type PickupAddress = typeof pickupAddresses.$inferSelect
export type NewPickupAddress = typeof pickupAddresses.$inferInsert

export const carriers = pgTable("carriers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  transitTime: varchar("transit_time", { length: 255 }).notNull().default("2-3 Business Days"),
  logo: text("logo"),
  freeShipping: boolean("free_shipping").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Carrier = typeof carriers.$inferSelect
export type NewCarrier = typeof carriers.$inferInsert

export const carrierRanges = pgTable("carrier_ranges", {
  id: serial("id").primaryKey(),
  carrierId: integer("carrier_id").references(() => carriers.id, { onDelete: "cascade" }),
  billingType: varchar("billing_type", { length: 50 }).notNull().default("weight"), // 'weight' | 'price'
  delimiter1: numeric("delimiter1", { precision: 10, scale: 2 }).notNull().default("0.00"),
  delimiter2: numeric("delimiter2", { precision: 10, scale: 2 }).notNull().default("10.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type CarrierRange = typeof carrierRanges.$inferSelect
export type NewCarrierRange = typeof carrierRanges.$inferInsert

export const carrierRangePrices = pgTable("carrier_range_prices", {
  id: serial("id").primaryKey(),
  carrierId: integer("carrier_id").references(() => carriers.id, { onDelete: "cascade" }),
  carrierRangeId: integer("carrier_range_id").references(() => carrierRanges.id, { onDelete: "cascade" }),
  zoneId: integer("zone_id").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type CarrierRangePrice = typeof carrierRangePrices.$inferSelect
export type NewCarrierRangePrice = typeof carrierRangePrices.$inferInsert

