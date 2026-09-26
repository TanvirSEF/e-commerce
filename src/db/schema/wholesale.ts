import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core"

export const wholesalePrices = pgTable("wholesale_prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  minQty: integer("min_qty").notNull(),
  maxQty: integer("max_qty").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type WholesalePrice = typeof wholesalePrices.$inferSelect
export type NewWholesalePrice = typeof wholesalePrices.$inferInsert
