import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const smsTemplates = pgTable("sms_templates", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  variables: jsonb("variables").$type<string[]>().default([]).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type SmsTemplate = typeof smsTemplates.$inferSelect
export type NewSmsTemplate = typeof smsTemplates.$inferInsert
