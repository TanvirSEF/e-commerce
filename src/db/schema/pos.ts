import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export interface PosLineItem {
  productId: number | string
  productName: string
  thumbnail?: string
  variant?: string
  price: number
  quantity: number
  lineTotal: number
}

export const posSales = pgTable("pos_sales", {
  id: serial("id").primaryKey(),
  orderCode: varchar("order_code", { length: 50 }).notNull().unique(),
  cashierName: varchar("cashier_name", { length: 100 }).default("Admin Cashier").notNull(),
  customerName: varchar("customer_name", { length: 150 }).default("Walk-in Customer").notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).default("N/A"),
  customerEmail: varchar("customer_email", { length: 150 }),
  sellerId: varchar("seller_id", { length: 50 }),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0.00").notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("Cash").notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull(),
  changeAmount: numeric("change_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  itemsJson: jsonb("items_json").$type<PosLineItem[]>().default([]).notNull(),
  status: varchar("status", { length: 30 }).default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type PosSale = typeof posSales.$inferSelect
export type NewPosSale = typeof posSales.$inferInsert
