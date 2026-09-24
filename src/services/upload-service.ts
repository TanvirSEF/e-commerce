import { db } from "@/db"
import { uploads, type Upload, type NewUpload } from "@/db/schema/uploads"
import { eq, desc, asc, ilike, and, inArray } from "drizzle-orm"

export const SEED_UPLOADS: Upload[] = [
  {
    id: 1,
    fileOriginalName: "iphone15-pro-max-banner.jpg",
    fileName: "/images/banners/banner1.jpg",
    userId: "admin",
    fileSize: 450200,
    extension: "jpg",
    type: "image",
    externalLink: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: 2,
    fileOriginalName: "samsung-galaxy-s24-ultra.png",
    fileName: "/images/products/s24-ultra.png",
    userId: "admin",
    fileSize: 320140,
    extension: "png",
    type: "image",
    externalLink: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: 3,
    fileOriginalName: "apple-watch-ultra-hero.jpg",
    fileName: "/images/products/apple-watch.jpg",
    userId: "admin",
    fileSize: 280900,
    extension: "jpg",
    type: "image",
    externalLink: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: 4,
    fileOriginalName: "sony-wh1000xm5-headphones.jpg",
    fileName: "/images/products/sony-headphones.jpg",
    userId: "admin",
    fileSize: 512000,
    extension: "jpg",
    type: "image",
    externalLink: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-12"),
  },
  {
    id: 5,
    fileOriginalName: "warranty_terms_and_policy.pdf",
    fileName: "/docs/warranty_terms.pdf",
    userId: "admin",
    fileSize: 1048576,
    extension: "pdf",
    type: "document",
    externalLink: null,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
]

export async function getAllUploads(params?: {
  search?: string
  type?: string
  sort?: string
}): Promise<Upload[]> {
  try {
    const list = await db.select().from(uploads).orderBy(desc(uploads.id))
    if (!list || list.length === 0) {
      // Seed default uploads
      try {
        for (const u of SEED_UPLOADS) {
          await db.insert(uploads).values({
            fileOriginalName: u.fileOriginalName,
            fileName: u.fileName,
            userId: u.userId,
            fileSize: u.fileSize,
            extension: u.extension,
            type: u.type,
            externalLink: u.externalLink,
          })
        }
        return await db.select().from(uploads).orderBy(desc(uploads.id))
      } catch {
        return filterUploads(SEED_UPLOADS, params)
      }
    }
    return filterUploads(list, params)
  } catch (error) {
    console.error("DB getAllUploads fallback:", error)
    return filterUploads(SEED_UPLOADS, params)
  }
}

function filterUploads(
  items: Upload[],
  params?: { search?: string; type?: string; sort?: string }
): Upload[] {
  let result = [...items]
  if (params?.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (f) =>
        f.fileOriginalName?.toLowerCase().includes(q) ||
        f.fileName.toLowerCase().includes(q) ||
        f.extension?.toLowerCase().includes(q)
    )
  }
  if (params?.type && params.type !== "all") {
    result = result.filter((f) => f.type === params.type)
  }
  if (params?.sort === "oldest") {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (params?.sort === "smallest") {
    result.sort((a, b) => (a.fileSize || 0) - (b.fileSize || 0))
  } else if (params?.sort === "largest") {
    result.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0))
  } else {
    // newest default
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return result
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
    if (ids.length === 0) return true
    await db.delete(uploads).where(inArray(uploads.id, ids))
    return true
  } catch (error) {
    console.error("Error bulk deleting uploads:", error)
    return false
  }
}
