import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core"

export const userSearches = pgTable("user_searches", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 255 }).notNull(),
  count: integer("count").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const commissionHistories = pgTable("commission_histories", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id"),
  orderCode: varchar("order_code", { length: 100 }).notNull(),
  sellerId: text("seller_id"),
  sellerName: varchar("seller_name", { length: 150 }),
  adminCommission: numeric("admin_commission", { precision: 12, scale: 2 }).default("0.00").notNull(),
  sellerEarning: numeric("seller_earning", { precision: 12, scale: 2 }).default("0.00").notNull(),
  orderFrom: varchar("order_from", { length: 20 }).default("web").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const aiTokenLogs = pgTable("ai_token_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  userName: varchar("user_name", { length: 150 }),
  feature: varchar("feature", { length: 255 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  promptTokens: integer("prompt_tokens").default(0).notNull(),
  completionTokens: integer("completion_tokens").default(0).notNull(),
  totalTokens: integer("total_tokens").default(0).notNull(),
  costUsd: numeric("cost_usd", { precision: 10, scale: 4 }).default("0.0000").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type UserSearch = typeof userSearches.$inferSelect
export type CommissionHistory = typeof commissionHistories.$inferSelect
export type AiTokenLog = typeof aiTokenLogs.$inferSelect
