import { db } from "@/db"
import { uploads, type Upload, type NewUpload } from "@/db/schema/uploads"
import { eq, desc, asc, ilike, and, inArray, or } from "drizzle-orm"

export async function getAllUploads(params?: {
  search?: string
  type?: string
  sort?: string
}): Promise<Upload[]> {
  try {
    const conditions = []

    if (params?.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`
      conditions.push(
        or(
          ilike(uploads.fileOriginalName, q),
          ilike(uploads.fileName, q),
          ilike(uploads.extension, q)
        )
      )
    }

    if (params?.type && params.type !== "all") {
      conditions.push(eq(uploads.type, params.type))
    }

    let orderByClause = desc(uploads.createdAt)
    if (params?.sort === "oldest") {
      orderByClause = asc(uploads.createdAt)
    } else if (params?.sort === "smallest") {
      orderByClause = asc(uploads.fileSize)
    } else if (params?.sort === "largest") {
      orderByClause = desc(uploads.fileSize)
    }

    const query = db
      .select()
      .from(uploads)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)

    const list = await query
    return list
  } catch (error) {
    console.error("DB getAllUploads error:", error)
    return []
  }
}

export async function createUploadRecord(data: {
  fileOriginalName: string
  fileName: string
  userId?: string
  fileSize?: number
  extension?: string
  type?: string
  externalLink?: string
}): Promise<Upload> {
  const [created] = await db
    .insert(uploads)
    .values({
      fileOriginalName: data.fileOriginalName,
      fileName: data.fileName,
      userId: data.userId || "admin",
      fileSize: data.fileSize || 0,
      extension: data.extension || "jpg",
      type: data.type || "image",
      externalLink: data.externalLink || null,
    })
    .returning()

  return created
}

export async function deleteUploadRecord(id: number): Promise<boolean> {
  try {
    await db.delete(uploads).where(eq(uploads.id, id))
    return true
  } catch (error) {
    console.error("Error deleting upload record:", error)
    return false
  }
}

export async function bulkDeleteUploadRecords(ids: number[]): Promise<boolean> {
  try {
    if (!ids || ids.length === 0) return true
    await db.delete(uploads).where(inArray(uploads.id, ids))
    return true
  } catch (error) {
    console.error("Error bulk deleting uploads:", error)
    return false
  }
}
