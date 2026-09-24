import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const dynamicPopups = pgTable("dynamic_popups", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  bannerUrl: text("banner_url").notNull(),
  btnText: varchar("btn_text", { length: 100 }),
  btnBackgroundColor: varchar("btn_background_color", { length: 50 }),
  btnTextColor: varchar("btn_text_color", { length: 20 }),
  link: text("link"),
  delaySec: integer("delay_sec").default(3).notNull(),
  durationSec: integer("duration_sec").default(15).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type DynamicPopup = typeof dynamicPopups.$inferSelect
export type NewDynamicPopup = typeof dynamicPopups.$inferInsert
