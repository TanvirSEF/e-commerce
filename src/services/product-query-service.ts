import { db } from "../db"
import { productQueries } from "../db/schema"
import { eq, desc, and, sql } from "drizzle-orm"

export interface ProductQueryItem {
  id: number
  productId?: number
  productName: string
  productSlug: string
  userId?: string
  userName: string
  userAvatar?: string
  question: string
  reply?: string
  repliedBy?: string
  status: "pending" | "approved" | "rejected"
  date: string
  createdAt: Date
}

export interface ProductQueriesResponse {
  queries: ProductQueryItem[]
  totalCount: number
  currentPage: number
  perPage: number
  totalPages: number
}

export async function getAllQueriesAdmin(params: {
  page?: number
  limit?: number
} = {}): Promise<ProductQueriesResponse> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 20)
  const offset = (page - 1) * limit

  try {
    const [countRes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productQueries)

    const totalCount = Number(countRes?.count || 0)
    const totalPages = Math.ceil(totalCount / limit) || 1

    const rows = await db
      .select()
      .from(productQueries)
      .orderBy(desc(productQueries.id))
      .limit(limit)
      .offset(offset)

    const mapped: ProductQueryItem[] = rows.map((r) => ({
      id: r.id,
      productId: r.productId || undefined,
      productName: r.productName,
      productSlug: r.productSlug,
      userId: r.userId || undefined,
      userName: r.userName,
      userAvatar: "/assets/img/avatar-placeholder.png",
      question: r.question,
      reply: r.reply || undefined,
      repliedBy: r.repliedBy || undefined,
      status: (r.status as "pending" | "approved" | "rejected") || "pending",
      date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      createdAt: r.createdAt || new Date(),
    }))

    return {
      queries: mapped,
      totalCount,
      currentPage: page,
      perPage: limit,
      totalPages,
    }
  } catch (err) {
    console.error("Error in getAllQueriesAdmin:", err)
    return {
      queries: [],
      totalCount: 0,
      currentPage: 1,
      perPage: limit,
      totalPages: 1,
    }
  }
}

export async function getQueryById(id: number): Promise<ProductQueryItem | null> {
  try {
    const [row] = await db
      .select()
      .from(productQueries)
      .where(eq(productQueries.id, id))
      .limit(1)

    if (!row) return null

    return {
      id: row.id,
      productId: row.productId || undefined,
      productName: row.productName,
      productSlug: row.productSlug,
      userId: row.userId || undefined,
      userName: row.userName,
      userAvatar: "/assets/img/avatar-placeholder.png",
      question: row.question,
      reply: row.reply || undefined,
      repliedBy: row.repliedBy || undefined,
      status: (row.status as "pending" | "approved" | "rejected") || "pending",
      date: row.createdAt ? row.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      createdAt: row.createdAt || new Date(),
    }
  } catch (err) {
    console.error("Error in getQueryById:", err)
    return null
  }
}

export async function replyProductQuery(data: {
  id: number
  reply: string
  repliedBy?: string
}): Promise<boolean> {
  try {
    await db
      .update(productQueries)
      .set({
        reply: data.reply,
        repliedBy: data.repliedBy || "Super Admin",
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(productQueries.id, data.id))

    return true
  } catch (err) {
    console.error("Error in replyProductQuery:", err)
    return false
  }
}

export async function deleteProductQuery(id: number): Promise<boolean> {
  try {
    await db.delete(productQueries).where(eq(productQueries.id, id))
    return true
  } catch (err) {
    console.error("Error in deleteProductQuery:", err)
    return false
  }
}

export async function getQueriesForProduct(productSlug: string): Promise<ProductQueryItem[]> {
  try {
    const rows = await db
      .select()
      .from(productQueries)
      .where(and(eq(productQueries.productSlug, productSlug), eq(productQueries.status, "approved")))
      .orderBy(desc(productQueries.id))

    return rows.map((r) => ({
      id: r.id,
      productId: r.productId || undefined,
      productName: r.productName,
      productSlug: r.productSlug,
      userName: r.userName,
      userAvatar: "/assets/img/avatar-placeholder.png",
      question: r.question,
      reply: r.reply || undefined,
      repliedBy: r.repliedBy || undefined,
      status: "approved",
      date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      createdAt: r.createdAt || new Date(),
    }))
  } catch (err) {
    console.warn("DB getQueriesForProduct error:", (err as Error).message)
    return []
  }
}

export async function askProductQuestion(data: {
  productSlug: string
  productName: string
  userName: string
  question: string
  userId?: string
}) {
  try {
    const [row] = await db
      .insert(productQueries)
      .values({
        productSlug: data.productSlug,
        productName: data.productName,
        userName: data.userName,
        question: data.question,
        userId: data.userId,
        status: "pending",
      })
      .returning()

    return { success: true, item: row }
  } catch (err) {
    console.error("askProductQuestion error:", (err as Error).message)
    return { success: false }
  }
}
