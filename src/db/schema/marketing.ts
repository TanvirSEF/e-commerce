import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const newsletterBroadcasts = pgTable("newsletter_broadcasts", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  recipientCount: integer("recipient_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const topBanners = pgTable("top_banners", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Subscriber = typeof subscribers.$inferSelect
export type NewsletterBroadcast = typeof newsletterBroadcasts.$inferSelect
export type TopBanner = typeof topBanners.$inferSelect
export type NewTopBanner = typeof topBanners.$inferInsert

