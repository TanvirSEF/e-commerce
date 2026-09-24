import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const orderNotes = pgTable("order_notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("shipping").notNull(), // 'shipping' | 'invoice' | 'fulfillment'
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type OrderNote = typeof orderNotes.$inferSelect
export type NewOrderNote = typeof orderNotes.$inferInsert
