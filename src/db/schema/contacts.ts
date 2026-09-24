import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }).default("General Inquiry").notNull(),
  content: text("content").notNull(),
  reply: text("reply"),
  status: varchar("status", { length: 20 }).default("unread").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type ContactInquiry = typeof contacts.$inferSelect
