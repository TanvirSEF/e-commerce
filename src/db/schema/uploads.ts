import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core"

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  fileOriginalName: text("file_original_name"),
  fileName: text("file_name").notNull(),
  userId: text("user_id"),
  fileSize: integer("file_size").default(0),
  extension: text("extension").default("jpg"),
  type: text("type").default("image"), // image, video, document, audio
  externalLink: text("external_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Upload = typeof uploads.$inferSelect
export type NewUpload = typeof uploads.$inferInsert
