import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 100 }).notNull().unique(),
  emailType: varchar("email_type", { length: 255 }).notNull(),
  receiver: varchar("receiver", { length: 50 }).notNull(), // "admin" | "seller" | "customer" | "all"
  subject: varchar("subject", { length: 255 }).notNull(),
  defaultText: text("default_text").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type EmailTemplate = typeof emailTemplates.$inferSelect
export type NewEmailTemplate = typeof emailTemplates.$inferInsert
