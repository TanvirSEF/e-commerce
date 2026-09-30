import { db } from "../db"
import { reviews, products, users } from "../db/schema"
import { eq, desc, and, sql, or, ilike } from "drizzle-orm"

export interface ReviewedProductSummary {
  id: number
  name: string
  thumbnailImg: string
  rating: number
  ownerName: string
  reviewCount: number
  unviewedCount: number
  hasNewReview: boolean
  customReviewCount: number
}

export interface ReviewedProductsResponse {
  products: ReviewedProductSummary[]
  totalCount: number
  currentPage: number
  perPage: number
  totalPages: number
}

export interface GetProductReviewsAdminParams {
  search?: string
  rating?: string // 'desc' | 'asc'
  sellerId?: string // 'all' | 'inhouse' | userId
  page?: number
  limit?: number
}

export async function getProductReviewsAdmin(
  params: GetProductReviewsAdminParams = {}
): Promise<ReviewedProductsResponse> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 15)
  const offset = (page - 1) * limit

  try {
    const conditions: string[] = []
    const values: (string | number)[] = []
    let valIndex = 1

    if (params.search && params.search.trim()) {
      conditions.push(`p.name ILIKE $${valIndex++}`)
      values.push(`%${params.search.trim()}%`)
    }

    if (params.sellerId && params.sellerId !== "all") {
      if (params.sellerId === "inhouse") {
        conditions.push(`(p.added_by = 'admin' OR p.user_id IS NULL)`)
      } else {
        conditions.push(`p.user_id = $${valIndex++}`)
        values.push(params.sellerId)
      }
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    let orderSql = "ORDER BY MAX(r.created_at) DESC"
    if (params.rating === "desc") {
      orderSql = "ORDER BY p.rating DESC"
    } else if (params.rating === "asc") {
      orderSql = "ORDER BY p.rating ASC"
    }

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int as count
      FROM products p
      JOIN reviews r ON r.product_id = p.id
      ${whereSql}
    `
    const countRes: any = await db.execute(sql.raw(
      values.length > 0
        ? countQuery.replace(/\$(\d+)/g, (_, i) => `'${values[Number(i) - 1]}'`)
        : countQuery
    ))
    const totalCount = Number(countRes.rows?.[0]?.count || 0)
    const totalPages = Math.ceil(totalCount / limit) || 1

    // Data query
    const dataQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.thumbnail_img as "thumbnailImg", 
        p.rating,
        p.added_by as "addedBy",
        p.user_id as "userId",
        u.name as "sellerName",
        COUNT(r.id)::int as "reviewCount",
        SUM(CASE WHEN r.viewed = false THEN 1 ELSE 0 END)::int as "unviewedCount",
        SUM(CASE WHEN r.type = 'custom' THEN 1 ELSE 0 END)::int as "customReviewCount"
      FROM products p
      JOIN reviews r ON r.product_id = p.id
      LEFT JOIN users u ON u.id = p.user_id
      ${whereSql}
      GROUP BY p.id, p.name, p.thumbnail_img, p.rating, p.added_by, p.user_id, u.name
      ${orderSql}
      LIMIT ${limit} OFFSET ${offset}
    `

    const rowsRes: any = await db.execute(sql.raw(
      values.length > 0
        ? dataQuery.replace(/\$(\d+)/g, (_, i) => `'${values[Number(i) - 1]}'`)
        : dataQuery
    ))

    const rawRows = Array.isArray(rowsRes) ? rowsRes : (rowsRes.rows || [])

    const mapped: ReviewedProductSummary[] = rawRows.map((r: any) => ({
      id: Number(r.id),
      name: r.name,
      thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
      rating: Number(r.rating) || 0,
      ownerName: r.addedBy === "admin" || !r.userId ? "In House" : r.sellerName || "Seller",
      reviewCount: Number(r.reviewCount) || 0,
      unviewedCount: Number(r.unviewedCount) || 0,
      hasNewReview: Number(r.unviewedCount) > 0,
      customReviewCount: Number(r.customReviewCount) || 0,
    }))

    return {
      products: mapped,
      totalCount,
      currentPage: page,
      perPage: limit,
      totalPages,
    }
  } catch (error) {
    console.error("Error in getProductReviewsAdmin:", error)
    return {
      products: [],
      totalCount: 0,
      currentPage: 1,
      perPage: limit,
      totalPages: 1,
    }
  }
}

export async function getSellersForReviewFilter(): Promise<{ id: string; name: string }[]> {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.role, "seller"))
      .orderBy(users.name)

    return rows.map((r) => ({
      id: r.id,
      name: r.name || "Seller",
    }))
  } catch (error) {
    console.error("Error in getSellersForReviewFilter:", error)
    return []
  }
}

export interface SingleReviewItem {
  id: number
  productId: number
  userId: string | null
  userName: string
  userAvatar: string
  rating: number
  comment: string
  photos: string[]
  status: boolean
  viewed: boolean
  type: string
  customReviewerName: string | null
  createdAt: string
}

export async function getProductDetailReviews(
  productId: number,
  reviewType: "real" | "custom" = "real",
  page = 1,
  limit = 15
) {
  try {
    // 1. Mark reviews as viewed
    await db
      .update(reviews)
      .set({ viewed: true })
      .where(eq(reviews.productId, productId))

    // 2. Fetch product info
    const [productRow] = await db
      .select({
        id: products.id,
        name: products.name,
        thumbnailImg: products.thumbnailImg,
        rating: products.rating,
      })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!productRow) return null

    // 3. Count counts
    const [counts] = await db
      .select({
        realCount: sql<number>`SUM(CASE WHEN ${reviews.type} = 'real' THEN 1 ELSE 0 END)::int`,
        customCount: sql<number>`SUM(CASE WHEN ${reviews.type} = 'custom' THEN 1 ELSE 0 END)::int`,
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))

    const realCount = Number(counts?.realCount || 0)
    const customCount = Number(counts?.customCount || 0)

    // 4. Query reviews list for the active tab
    const offset = (page - 1) * limit
    const reviewRows = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        userName: reviews.userName,
        userAvatar: reviews.userAvatar,
        rating: reviews.rating,
        comment: reviews.comment,
        photos: reviews.photos,
        status: reviews.status,
        viewed: reviews.viewed,
        type: reviews.type,
        customReviewerName: reviews.customReviewerName,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.type, reviewType)))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset)

    const mappedReviews: SingleReviewItem[] = reviewRows.map((r) => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.type === "custom" && r.customReviewerName ? r.customReviewerName : r.userName,
      userAvatar: r.userAvatar || "/assets/img/avatar-placeholder.png",
      rating: r.rating,
      comment: r.comment,
      photos: r.photos || [],
      status: r.status,
      viewed: r.viewed,
      type: r.type,
      customReviewerName: r.customReviewerName,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }))

    const totalInTab = reviewType === "real" ? realCount : customCount

    return {
      product: {
        id: productRow.id,
        name: productRow.name,
        thumbnailImg: productRow.thumbnailImg || "/assets/img/placeholder.jpg",
        rating: Number(productRow.rating) || 0,
      },
      reviews: mappedReviews,
      realCount,
      customCount,
      totalCount: totalInTab,
      currentPage: page,
      totalPages: Math.ceil(totalInTab / limit) || 1,
    }
  } catch (error) {
    console.error("Error in getProductDetailReviews:", error)
    return null
  }
}

export async function toggleReviewStatus(id: number, status: boolean): Promise<boolean> {
  try {
    const [rev] = await db
      .update(reviews)
      .set({ status, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning({ productId: reviews.productId })

    if (rev) {
      await recalculateProductRating(rev.productId)
    }
    return true
  } catch (error) {
    console.error("Error in toggleReviewStatus:", error)
    return false
  }
}

export async function deleteReview(id: number): Promise<boolean> {
  try {
    const [rev] = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({ productId: reviews.productId })

    if (rev) {
      await recalculateProductRating(rev.productId)
    }
    return true
  } catch (error) {
    console.error("Error in deleteReview:", error)
    return false
  }
}

export async function createCustomReview(data: {
  productId: number
  reviewerName: string
  reviewerImage?: string
  rating: number
  comment: string
}): Promise<boolean> {
  try {
    await db.insert(reviews).values({
      productId: data.productId,
      userName: data.reviewerName,
      userAvatar: data.reviewerImage || "/assets/img/avatar-placeholder.png",
      customReviewerName: data.reviewerName,
      customReviewerImage: data.reviewerImage || null,
      type: "custom",
      rating: data.rating,
      comment: data.comment,
      status: true,
      viewed: true,
    })

    await recalculateProductRating(data.productId)
    return true
  } catch (error) {
    console.error("Error in createCustomReview:", error)
    return false
  }
}

export async function getProductsForReviewSelect(): Promise<{ id: number; name: string; thumbnailImg: string }[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        thumbnailImg: products.thumbnailImg,
      })
      .from(products)
      .where(eq(products.published, true))
      .orderBy(products.name)

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
    }))
  } catch (err) {
    console.error("Error in getProductsForReviewSelect:", err)
    return []
  }
}

export async function getProductReviews(productIdOrSlug: string): Promise<ReviewItem[]> {
  try {
    const numericId = parseInt(productIdOrSlug.replace(/\D/g, "")) || 1
    const rows = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        productName: products.name,
        productThumbnail: products.thumbnailImg,
        productSlug: products.slug,
        userName: reviews.userName,
        userAvatar: reviews.userAvatar,
        rating: reviews.rating,
        comment: reviews.comment,
        photos: reviews.photos,
        status: reviews.status,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(and(eq(reviews.productId, numericId), eq(reviews.status, true)))
      .orderBy(desc(reviews.createdAt))

    return rows.map((r) => ({
      id: String(r.id),
      productId: String(r.productId),
      productName: r.productName || "Product",
      productThumbnail: r.productThumbnail || "/assets/img/placeholder.jpg",
      productSlug: r.productSlug || "",
      userName: r.userName,
      userAvatar: r.userAvatar || "/assets/img/avatar-placeholder.png",
      rating: r.rating,
      comment: r.comment,
      photos: r.photos || [],
      status: r.status,
      date: r.createdAt.toISOString().slice(0, 10),
    }))
  } catch (err) {
    console.warn("DB getProductReviews error:", (err as Error).message)
    return []
  }
}

export interface ReviewItem {
  id: string
  productId: string
  productName: string
  productThumbnail: string
  productSlug?: string
  userId?: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  photos: string[]
  status: boolean
  date: string
}

export async function submitReview(data: {
  productId: number
  userId?: string
  userName: string
  rating: number
  comment: string
  photos?: string[]
}) {
  try {
    const [inserted] = await db
      .insert(reviews)
      .values({
        productId: data.productId,
        userId: data.userId || null,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        photos: data.photos || [],
        status: true,
        type: "real",
      })
      .returning()

    await recalculateProductRating(data.productId)
    return { success: true, review: inserted }
  } catch (err) {
    console.error("submitReview error:", (err as Error).message)
    return { success: false }
  }
}

async function recalculateProductRating(productId: number) {
  try {
    const [res] = await db
      .select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, true)))

    const avg = Number(res?.avgRating || 0)
    const count = Number(res?.count || 0)

    await db
      .update(products)
      .set({
        rating: avg.toFixed(2),
        numOfReviews: count,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
  } catch (err) {
    console.error("Error recalculating product rating:", err)
  }
}
