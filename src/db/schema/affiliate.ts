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

export const affiliateUsers = pgTable("affiliate_users", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 100 }),
  userName: varchar("user_name", { length: 150 }).notNull(),
  userEmail: varchar("user_email", { length: 150 }).notNull(),
  paypalEmail: varchar("paypal_email", { length: 150 }),
  bankInfo: text("bank_info"),
  balance: numeric("balance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  status: boolean("status").default(true).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateOptions = pgTable("affiliate_options", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull().unique(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  status: boolean("status").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const affiliateConfigs = pgTable("affiliate_configs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
})

export const affiliateWithdrawRequests = pgTable("affiliate_withdraw_requests", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  userName: varchar("user_name", { length: 150 }).notNull(),
  userEmail: varchar("user_email", { length: 150 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateLogs = pgTable("affiliate_logs", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  referredUserName: varchar("referred_user_name", { length: 150 }).notNull(),
  affiliateType: varchar("affiliate_type", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  orderCode: varchar("order_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type AffiliateUser = typeof affiliateUsers.$inferSelect
export type NewAffiliateUser = typeof affiliateUsers.$inferInsert
export type AffiliateOption = typeof affiliateOptions.$inferSelect
export type AffiliateConfig = typeof affiliateConfigs.$inferSelect
export type AffiliateWithdrawRequest = typeof affiliateWithdrawRequests.$inferSelect
export type AffiliateLog = typeof affiliateLogs.$inferSelect
