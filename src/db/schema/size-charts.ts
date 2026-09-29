import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  text,
} from "drizzle-orm/pg-core"

export interface SizeMeasurementRow {
  size: string // e.g. "S", "M", "L", "XL", "XXL", "3XL"
  chest?: string
  waist?: string
  hip?: string
  length?: string
  shoulder?: string
  inseam?: string
  [key: string]: string | undefined
}

export const sizeCharts = pgTable("size_charts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: integer("category_id").notNull(),
  fitType: varchar("fit_type", { length: 191 }).default("regular_fit"),
  stretchType: varchar("stretch_type", { length: 191 }).default("slight"),
  photos: text("photos"),
  description: text("description"),
  measurementPoints: jsonb("measurement_points").$type<string[]>().default([]),
  sizeOptions: jsonb("size_options").$type<string[]>().default([]),
  measurementOption: jsonb("measurement_option").$type<string[]>().default(["inch"]),
  unit: varchar("unit", { length: 20 }).default("in").notNull(), // 'in' | 'cm'
  measurements: jsonb("measurements").$type<SizeMeasurementRow[]>().default([]).notNull(),
  sizeChartValues: jsonb("size_chart_values").$type<Record<string, Record<string, { inch?: string; cen?: string }>>>().default({}),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type SizeChart = typeof sizeCharts.$inferSelect
export type NewSizeChart = typeof sizeCharts.$inferInsert

export const measurementPoints = pgTable("measurement_points", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type MeasurementPoint = typeof measurementPoints.$inferSelect
export type NewMeasurementPoint = typeof measurementPoints.$inferInsert

