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
import { users } from "./auth"
import { orders } from "./orders"

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDetails: text("payment_details"),
  offlinePayment: boolean("offline_payment").default(false).notNull(),
  approval: boolean("approval").default(true).notNull(),
  addedBy: varchar("added_by", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const clubPoints = pgTable("club_points", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
  points: integer("points").default(0).notNull(),
  converted: boolean("converted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  details: text("details").notNull(),
  files: jsonb("files").$type<string[]>().default([]).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  viewed: boolean("viewed").default(false).notNull(),
  clientViewed: boolean("client_viewed").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ticketReplies = pgTable("ticket_replies", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reply: text("reply").notNull(),
  files: jsonb("files").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}))

export const clubPointsRelations = relations(clubPoints, ({ one }) => ({
  user: one(users, {
    fields: [clubPoints.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [clubPoints.orderId],
    references: [orders.id],
  }),
}))

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
  replies: many(ticketReplies),
}))

export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketReplies.ticketId],
    references: [tickets.id],
  }),
  user: one(users, {
    fields: [ticketReplies.userId],
    references: [users.id],
  }),
}))

export const customerProducts = pgTable("customer_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 150 }).notNull(),
  thumbnailImg: text("thumbnail_img").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  condition: varchar("condition", { length: 50 }).default("used").notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  location: varchar("location", { length: 255 }).default("Dhaka, Bangladesh").notNull(),
  published: boolean("published").default(true).notNull(),
  status: varchar("status", { length: 50 }).default("approved").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type CustomerProduct = typeof customerProducts.$inferSelect
