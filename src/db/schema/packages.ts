import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const sellerPackages = pgTable("seller_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  productUploadLimit: integer("product_upload_limit").default(100).notNull(),
  duration: integer("duration").default(30).notNull(), // days
  logo: varchar("logo", { length: 500 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const sellerPackagePayments = pgTable("seller_package_payments", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  sellerPackageId: integer("seller_package_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDetails: text("payment_details"),
  offlinePayment: boolean("offline_payment").default(false).notNull(),
  approval: boolean("approval").default(true).notNull(),
  receipt: varchar("receipt", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const customerPackages = pgTable("customer_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  productUpload: integer("product_upload").default(10).notNull(),
  logo: varchar("logo", { length: 500 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const customerPackagePayments = pgTable("customer_package_payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  customerPackageId: integer("customer_package_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDetails: text("payment_details"),
  offlinePayment: boolean("offline_payment").default(false).notNull(),
  approval: boolean("approval").default(true).notNull(),
  receipt: varchar("receipt", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type SellerPackage = typeof sellerPackages.$inferSelect
export type NewSellerPackage = typeof sellerPackages.$inferInsert
export type SellerPackagePayment = typeof sellerPackagePayments.$inferSelect
export type NewSellerPackagePayment = typeof sellerPackagePayments.$inferInsert
export type CustomerPackage = typeof customerPackages.$inferSelect
export type NewCustomerPackage = typeof customerPackages.$inferInsert
export type CustomerPackagePayment = typeof customerPackagePayments.$inferSelect
export type NewCustomerPackagePayment = typeof customerPackagePayments.$inferInsert
