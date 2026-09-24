import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core"

export const customNotifications = pgTable("custom_notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  link: text("link"),
  notificationType: varchar("notification_type", { length: 100 }).default("General").notNull(),
  recipientCount: integer("recipient_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type CustomNotification = typeof customNotifications.$inferSelect
export type NewCustomNotification = typeof customNotifications.$inferInsert
