import { pgTable, serial, integer, text, boolean, timestamp, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./auth"
import { shops } from "./shops"

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id").references(() => users.id, { onDelete: "cascade" }),
  shopId: integer("shop_id").references(() => shops.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull().default("Inquiry"),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  attachments: text("attachments").array(),
  viewed: boolean("viewed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  sender: one(users, {
    fields: [conversations.senderId],
    references: [users.id],
    relationName: "conversationSender",
  }),
  receiver: one(users, {
    fields: [conversations.receiverId],
    references: [users.id],
    relationName: "conversationReceiver",
  }),
  shop: one(shops, {
    fields: [conversations.shopId],
    references: [shops.id],
  }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}))

export type Conversation = typeof conversations.$inferSelect
export type Message = typeof messages.$inferSelect
