import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core"

export const productQueries = pgTable("product_queries", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSlug: varchar("product_slug", { length: 255 }).notNull(),
  userId: text("user_id"),
  userName: varchar("user_name", { length: 255 }).notNull(),
  question: text("question").notNull(),
  reply: text("reply"),
  repliedBy: varchar("replied_by", { length: 150 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type ProductQuery = typeof productQueries.$inferSelect
export type NewProductQuery = typeof productQueries.$inferInsert
