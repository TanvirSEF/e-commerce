import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const preorderProducts = pgTable("preorder_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }),
  thumbnail: varchar("thumbnail", { length: 500 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  prepaymentAmount: numeric("prepayment_amount", { precision: 10, scale: 2 }).notNull(),
  releaseDate: timestamp("release_date").notNull(),
  preorderBatchLimit: integer("preorder_batch_limit").default(100).notNull(),
  currentPreorders: integer("current_preorders").default(0).notNull(),
  sellerSlug: varchar("seller_slug", { length: 100 }).default("inhouse"),
  status: boolean("status").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const preorderOrders = pgTable("preorder_orders", {
  id: serial("id").primaryKey(),
  orderCode: varchar("order_code", { length: 50 }).notNull().unique(),
  customerName: varchar("150").notNull(),
  customerEmail: varchar("150").notNull(),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  prepaymentPaid: numeric("prepayment_paid", { precision: 10, scale: 2 }).notNull(),
  remainingDue: numeric("remaining_due", { precision: 10, scale: 2 }).notNull(),
  preorderStatus: varchar("preorder_status", { length: 50 }).default("deposit_paid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type PreorderProduct = typeof preorderProducts.$inferSelect
export type NewPreorderProduct = typeof preorderProducts.$inferInsert
export type PreorderOrder = typeof preorderOrders.$inferSelect
export type NewPreorderOrder = typeof preorderOrders.$inferInsert
