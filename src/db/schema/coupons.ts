import {
  pgTable,
  serial,
  varchar,
  boolean,
  numeric,
  bigint,
  timestamp,
  jsonb,
  text,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./auth"

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).default("cart_base").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  details: jsonb("details").$type<{ min_buy?: number; max_discount?: number; product_ids?: number[] }>(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull(),
  discountType: varchar("discount_type", { length: 20 }).default("percent").notNull(),
  startDate: bigint("start_date", { mode: "number" }).notNull(),
  endDate: bigint("end_date", { mode: "number" }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const couponsRelations = relations(coupons, ({ one }) => ({
  user: one(users, {
    fields: [coupons.userId],
    references: [users.id],
  }),
}))
