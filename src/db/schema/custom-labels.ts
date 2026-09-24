import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const customLabels = pgTable("custom_labels", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  backgroundColor: varchar("background_color", { length: 50 }).default("#e1e1e1").notNull(),
  textColor: varchar("text_color", { length: 50 }).default("#ffffff").notNull(),
  userType: varchar("user_type", { length: 50 }).default("admin").notNull(), // 'admin' | 'seller'
  addedBy: text("added_by").default("Admin").notNull(),
  sellerAccess: boolean("seller_access").default(true).notNull(),
  status: boolean("status").default(true).notNull(),
  productIds: jsonb("product_ids").$type<number[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type CustomLabel = typeof customLabels.$inferSelect
export type NewCustomLabel = typeof customLabels.$inferInsert
