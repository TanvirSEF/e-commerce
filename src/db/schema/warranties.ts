import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"

export const warranties = pgTable("warranties", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  logo: text("logo"),
  duration: varchar("duration", { length: 50 }).default("1 Year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type WarrantyItem = typeof warranties.$inferSelect
