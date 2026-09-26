import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core"

export const auctionProducts = pgTable("auction_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  thumbnail: varchar("thumbnail", { length: 500 }).notNull(),
  description: text("description"),
  startingBid: numeric("starting_bid", { precision: 10, scale: 2 }).notNull(),
  currentBid: numeric("current_bid", { precision: 10, scale: 2 }).notNull(),
  minBidIncrement: numeric("min_bid_increment", { precision: 10, scale: 2 }).default("10.00").notNull(),
  auctionStartDate: timestamp("auction_start_date").notNull(),
  auctionEndDate: timestamp("auction_end_date").notNull(),
  totalBids: integer("total_bids").default(0).notNull(),
  sellerSlug: varchar("seller_slug", { length: 100 }).default("inhouse").notNull(),
  sellerName: varchar("seller_name", { length: 150 }).default("In-House Store").notNull(),
  status: boolean("status").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  winnerUserId: varchar("winner_user_id", { length: 100 }),
  winnerName: varchar("winner_name", { length: 150 }),
  winnerBid: numeric("winner_bid", { precision: 10, scale: 2 }),
  isClosed: boolean("is_closed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const auctionBids = pgTable("auction_bids", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userName: varchar("user_name", { length: 150 }).notNull(),
  userEmail: varchar("user_email", { length: 150 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  isHighest: boolean("is_highest").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const auctionOrders = pgTable("auction_orders", {
  id: serial("id").primaryKey(),
  orderCode: varchar("order_code", { length: 50 }).notNull().unique(),
  productId: integer("product_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  customerEmail: varchar("customer_email", { length: 150 }).notNull(),
  winningBid: numeric("winning_bid", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("paid").notNull(),
  deliveryStatus: varchar("delivery_status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type AuctionProduct = typeof auctionProducts.$inferSelect
export type NewAuctionProduct = typeof auctionProducts.$inferInsert
export type AuctionBid = typeof auctionBids.$inferSelect
export type NewAuctionBid = typeof auctionBids.$inferInsert
export type AuctionOrder = typeof auctionOrders.$inferSelect
export type NewAuctionOrder = typeof auctionOrders.$inferInsert
