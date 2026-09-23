import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
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

export type Subscriber = typeof subscribers.$inferSelect
export type NewsletterBroadcast = typeof newsletterBroadcasts.$inferSelect
