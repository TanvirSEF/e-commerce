import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export interface SizeMeasurementRow {
  size: string // e.g. "S", "M", "L", "XL", "XXL", "3XL"
  chest?: string
  waist?: string
  hip?: string
  length?: string
  shoulder?: string
  inseam?: string
}

export const sizeCharts = pgTable("size_charts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: integer("category_id").notNull(),
  fitType: varchar("fit_type", { length: 50 }).default("Regular").notNull(), // 'Regular' | 'Slim' | 'Oversized'
  unit: varchar("unit", { length: 20 }).default("in").notNull(), // 'in' | 'cm'
  measurements: jsonb("measurements").$type<SizeMeasurementRow[]>().default([]).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type SizeChart = typeof sizeCharts.$inferSelect
export type NewSizeChart = typeof sizeCharts.$inferInsert
