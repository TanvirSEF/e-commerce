import { pgTable, serial, integer, text, boolean, timestamp, varchar, numeric } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { orders } from "./orders"
import { users } from "./auth"
import { shops } from "./shops"

export const refundRequests = pgTable("refund_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }),
  orderCode: varchar("order_code", { length: 50 }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  userName: varchar("user_name", { length: 255 }).notNull().default("Customer"),
  shopId: integer("shop_id").references(() => shops.id, { onDelete: "set null" }),
  shopName: varchar("shop_name", { length: 255 }).default("Active Fashion Outlet"),
  productName: text("product_name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  attachment: text("attachment"),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending | approved | rejected
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const refundRequestsRelations = relations(refundRequests, ({ one }) => ({
  order: one(orders, {
    fields: [refundRequests.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [refundRequests.userId],
    references: [users.id],
  }),
  shop: one(shops, {
    fields: [refundRequests.shopId],
    references: [shops.id],
  }),
}))

export type RefundRequest = typeof refundRequests.$inferSelect
export type NewRefundRequest = typeof refundRequests.$inferInsert
