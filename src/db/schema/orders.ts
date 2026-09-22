import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./auth"
import { products } from "./products"

export const customerAddresses = pgTable("customer_addresses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  country: varchar("country", { length: 100 }).default("Bangladesh").notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 50 }),
  setDefault: boolean("set_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  code: varchar("code", { length: 50 }).notNull().unique(),
  trackingCode: varchar("tracking_code", { length: 50 }).notNull().unique(),
  shippingAddress: jsonb("shipping_address").$type<{
    name?: string
    email?: string
    address?: string
    country?: string
    city?: string
    postal_code?: string
    phone?: string
  }>(),
  paymentType: varchar("payment_type", { length: 50 }).default("cash_on_delivery").notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid").notNull(),
  deliveryStatus: varchar("delivery_status", { length: 50 }).default("pending").notNull(),
  grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).notNull(),
  couponDiscount: numeric("coupon_discount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
  viewed: boolean("viewed").default(false).notNull(),
  deliveryViewed: boolean("delivery_viewed").default(false).notNull(),
  paymentStatusViewed: boolean("payment_status_viewed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  variation: varchar("variation", { length: 100 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0.00").notNull(),
  shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
