import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const staffRoles = pgTable("staff_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  permissions: jsonb("permissions").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const staffs = pgTable("staffs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  roleId: integer("role_id").references(() => staffRoles.id, { onDelete: "set null" }),
  roleName: varchar("role_name", { length: 150 }).default("Staff").notNull(),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type StaffRole = typeof staffRoles.$inferSelect
export type Staff = typeof staffs.$inferSelect
