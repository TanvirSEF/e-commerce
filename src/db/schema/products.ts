import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  icon: text("icon"),
  banner: text("banner"),
  featured: boolean("featured").default(false).notNull(),
  orderLevel: integer("order_level").default(0).notNull(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  top: boolean("top").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
  photos: jsonb("photos").$type<string[]>().default([]).notNull(),
  thumbnailImg: text("thumbnail_img").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  discountType: varchar("discount_type", { length: 20 }).default("percent").notNull(),
  currentStock: integer("current_stock").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).default("pc").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0.00").notNull(),
  numOfReviews: integer("num_of_reviews").default(0).notNull(),
  numOfSale: integer("num_of_sale").default(0).notNull(),
  description: text("description"),
  colors: jsonb("colors").$type<string[]>().default([]).notNull(),
  choiceOptions: jsonb("choice_options").$type<{ attribute_id: string; values: string[] }[]>().default([]).notNull(),
  variations: jsonb("variations").$type<{ variant: string; sku: string; price: number; stock: number }[]>().default([]).notNull(),
  featured: boolean("featured").default(false).notNull(),
  todaysDeal: boolean("todays_deal").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, { relationName: "category_parent" }),
  products: many(products),
}))

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}))
