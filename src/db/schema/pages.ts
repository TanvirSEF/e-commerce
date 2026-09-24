import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core"

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("custom_page"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  metaImage: text("meta_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
