import {
  pgTable,
  serial,
  varchar,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  appLangCode: varchar("app_lang_code", { length: 20 }).default("en"),
  rtl: boolean("rtl").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  lang: varchar("lang", { length: 20 }).notNull(),
  langKey: varchar("lang_key", { length: 255 }).notNull(),
  langValue: text("lang_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Language = typeof languages.$inferSelect
export type NewLanguage = typeof languages.$inferInsert
export type Translation = typeof translations.$inferSelect
export type NewTranslation = typeof translations.$inferInsert
