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

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  topBanner: text("top_banner"),
  sliders: jsonb("sliders").$type<string[]>().default([]).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0.00").notNull(),
  numOfReviews: integer("num_of_reviews").default(0).notNull(),
  verificationStatus: boolean("verification_status").default(true).notNull(),
  verificationInfo: jsonb("verification_info").$type<{
    nidNumber?: string
    tradeLicense?: string
    documentType?: string
    documentUrl?: string
    bankName?: string
    bankAccount?: string
    submittedAt?: string
    rejectionReason?: string
  }>(),
  facebook: text("facebook"),
  instagram: text("instagram"),
  google: text("google"),
  twitter: text("twitter"),
  youtube: text("youtube"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const shopFollowers = pgTable("shop_followers", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const sellerWithdrawRequests = pgTable("seller_withdraw_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const shopsRelations = relations(shops, ({ one, many }) => ({
  user: one(users, {
    fields: [shops.userId],
    references: [users.id],
  }),
  followers: many(shopFollowers),
  withdrawRequests: many(sellerWithdrawRequests),
}))

export const shopFollowersRelations = relations(shopFollowers, ({ one }) => ({
  shop: one(shops, {
    fields: [shopFollowers.shopId],
    references: [shops.id],
  }),
  user: one(users, {
    fields: [shopFollowers.userId],
    references: [users.id],
  }),
}))

export const sellerWithdrawRequestsRelations = relations(
  sellerWithdrawRequests,
  ({ one }) => ({
    shop: one(shops, {
      fields: [sellerWithdrawRequests.shopId],
      references: [shops.id],
    }),
    user: one(users, {
      fields: [sellerWithdrawRequests.userId],
      references: [users.id],
    }),
  })
)
