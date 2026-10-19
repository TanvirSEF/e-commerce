"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { cancelCustomerOrder } from "@/services/order-service"
import { db } from "@/db"
import { reviews, products } from "@/db/schema"
import { sql, eq } from "drizzle-orm"

async function resolveUserId(): Promise<string> {
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      return session.user.id
    }
  } catch {
    // fallback
  }
  return "usr_customer_default_01"
}

export async function cancelOrderAction(orderId: number, code?: string) {
  const userId = await resolveUserId()
  const result = await cancelCustomerOrder(userId, orderId)

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/purchase-history")
  if (code) {
    revalidatePath(`/dashboard/purchase-history/${code}`)
  }
  revalidatePath("/admin/orders")

  return result
}

export async function submitProductReviewAction(data: {
  productId: number
  orderCode?: string
  rating: number
  comment: string
  photos?: string[]
}) {
  const userId = await resolveUserId()

  try {
    let userName = "Valued Customer"
    let userAvatar = "/assets/img/avatar-placeholder.png"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.name) {
        userName = session.user.name
        userAvatar = session.user.image || userAvatar
      }
    } catch {
      // fallback
    }

    const { and } = await import("drizzle-orm")
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.productId, data.productId), eq(reviews.userId, userId)))
      .limit(1)

    if (existing) {
      return { success: false, message: "You have already reviewed this product." }
    }

    await db.insert(reviews).values({
      productId: data.productId,
      userId,
      userName,
      userAvatar,
      rating: data.rating,
      comment: data.comment,
      photos: data.photos || [],
      status: true,
      viewed: false,
      type: "real",
    })

    // Recalculate average rating & reviews count
    const [avgResult] = await db
      .select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, data.productId))

    await db
      .update(products)
      .set({
        rating: String(Number(avgResult?.avgRating || 0).toFixed(2)),
        numOfReviews: Number(avgResult?.count || 1),
      })
      .where(eq(products.id, data.productId))

    try {
      revalidatePath("/dashboard/purchase-history")
      revalidatePath("/products")
      revalidatePath("/product")
      revalidatePath("/admin/products/reviews")
      revalidatePath("/seller/product-reviews")
    } catch {}

    return { success: true, message: "Review submitted successfully." }
  } catch (err) {
    console.error("submitProductReviewAction error:", err)
    return { success: false, message: "Failed to submit review." }
  }
}
