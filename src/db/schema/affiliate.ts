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
  phone: varchar("phone", { length: 50 }),
  paypalEmail: varchar("paypal_email", { length: 150 }),
  bankInfo: text("bank_info"),
  verificationInfo: text("verification_info"), // Dynamic JSON of submitted applicant fields
  balance: numeric("balance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  status: boolean("status").default(true).notNull(),
  approved: boolean("approved").default(true).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateOptions = pgTable("affiliate_options", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull().unique(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  details: text("details"), // JSON for category-wise commission overrides or specific settings
  status: boolean("status").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const affiliateConfigs = pgTable("affiliate_configs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
})

export const affiliatePayments = pgTable("affiliate_payments", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDetails: text("payment_details"),
  txnCode: varchar("txn_code", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateReferrals = pgTable("affiliate_referrals", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  referredUserName: varchar("referred_user_name", { length: 150 }).notNull(),
  referredUserEmail: varchar("referred_user_email", { length: 150 }).notNull(),
  referredUserPhone: varchar("referred_user_phone", { length: 50 }),
  referralType: varchar("referral_type", { length: 50 }).default("Registration").notNull(),
  orderCode: varchar("order_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateWithdrawRequests = pgTable("affiliate_withdraw_requests", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  userName: varchar("user_name", { length: 150 }).notNull(),
  userEmail: varchar("user_email", { length: 150 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentDetails: text("payment_details"),
  txnCode: varchar("txn_code", { length: 100 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const affiliateLogs = pgTable("affiliate_logs", {
  id: serial("id").primaryKey(),
  affiliateUserId: integer("affiliate_user_id").notNull(),
  affiliateUserName: varchar("affiliate_user_name", { length: 150 }),
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
export type AffiliatePayment = typeof affiliatePayments.$inferSelect
export type NewAffiliatePayment = typeof affiliatePayments.$inferInsert
export type AffiliateReferral = typeof affiliateReferrals.$inferSelect
export type NewAffiliateReferral = typeof affiliateReferrals.$inferInsert
export type AffiliateWithdrawRequest = typeof affiliateWithdrawRequests.$inferSelect
export type NewAffiliateWithdrawRequest = typeof affiliateWithdrawRequests.$inferInsert
export type AffiliateLog = typeof affiliateLogs.$inferSelect
export type NewAffiliateLog = typeof affiliateLogs.$inferInsert
