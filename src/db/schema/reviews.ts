import { pgTable, serial, integer, text, boolean, timestamp, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { products } from "./products"
import { users } from "./auth"

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: varchar("user_name", { length: 255 }).notNull().default("Customer"),
  userAvatar: text("user_avatar").default("/assets/img/avatar-placeholder.png"),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  photos: text("photos").array(),
  status: boolean("status").notNull().default(true), // published
  viewed: boolean("viewed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
