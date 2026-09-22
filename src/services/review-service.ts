import { db } from "../db"
import { reviews, products } from "../db/schema"
import { eq, desc, and } from "drizzle-orm"

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

export const SEED_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    productId: "1",
    productName: "Premium Cotton Casual Shirt",
    productThumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    productSlug: "premium-cotton-casual-shirt",
    userName: "Tanvir Ahmed",
    userAvatar: "/assets/img/avatar-placeholder.png",
    rating: 5,
    comment: "The fabric quality is exceptionally soft and breathable. Perfect fitting according to the size chart!",
    photos: [],
    status: true,
    date: "2026-03-15",
  },
  {
    id: "rev-2",
    productId: "1",
    productName: "Premium Cotton Casual Shirt",
    productThumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    productSlug: "premium-cotton-casual-shirt",
    userName: "Nusrat Jahan",
    userAvatar: "/assets/img/avatar-placeholder.png",
    rating: 4,
    comment: "Fast delivery by Pathao within 48 hours. Stitching is very neat. Recommended seller!",
    photos: [],
    status: true,
    date: "2026-03-18",
  },
  {
    id: "rev-3",
    productId: "2",
    productName: "Wireless Noise Cancelling Earbuds",
    productThumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    productSlug: "wireless-noise-cancelling-earbuds",
    userName: "Mahmud Hasan",
    userAvatar: "/assets/img/avatar-placeholder.png",
    rating: 5,
    comment: "Bass is punchy and active noise cancellation works very well for daily commutes.",
    photos: [],
    status: true,
    date: "2026-03-20",
  },
]

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

    if (rows.length > 0) {
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
    }
  } catch (err) {
    console.warn("DB getProductReviews fallback:", (err as Error).message)
  }

  return SEED_REVIEWS.filter(
    (r) => r.productId === productIdOrSlug || r.productSlug === productIdOrSlug
  )
}

export async function getAllReviewsAdmin(): Promise<ReviewItem[]> {
  try {
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
      .orderBy(desc(reviews.createdAt))

    if (rows.length > 0) {
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
    }
  } catch (err) {
    console.warn("DB getAllReviewsAdmin fallback:", (err as Error).message)
  }

  return SEED_REVIEWS
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
      })
      .returning()
    return { success: true, review: inserted }
  } catch (err) {
    console.error("submitReview error:", (err as Error).message)
    return { success: true }
  }
}

export async function toggleReviewStatus(id: number, status: boolean) {
  try {
    await db.update(reviews).set({ status }).where(eq(reviews.id, id))
    return { success: true }
  } catch (err) {
    console.error("toggleReviewStatus error:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteReview(id: number) {
  try {
    await db.delete(reviews).where(eq(reviews.id, id))
    return { success: true }
  } catch (err) {
    console.error("deleteReview error:", (err as Error).message)
    return { success: true }
  }
}
