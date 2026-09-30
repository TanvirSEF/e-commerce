"use server"

import { revalidatePath } from "next/cache"
import {
  getProductReviewsAdmin,
  toggleReviewStatus,
  deleteReview,
  createCustomReview,
  type GetProductReviewsAdminParams,
  type ReviewedProductsResponse,
} from "@/services/review-service"

export async function fetchProductReviewsAdminAction(
  params: GetProductReviewsAdminParams
): Promise<ReviewedProductsResponse> {
  return await getProductReviewsAdmin(params)
}

export async function toggleReviewPublishedAction(
  reviewId: number,
  status: boolean,
  productId?: number
): Promise<boolean> {
  const success = await toggleReviewStatus(reviewId, status)
  if (success) {
    revalidatePath("/admin/reviews")
    if (productId) {
      revalidatePath(`/admin/reviews/detail-reviews/${productId}`)
    }
  }
  return success
}

export async function deleteReviewAction(
  reviewId: number,
  productId?: number
): Promise<boolean> {
  const success = await deleteReview(reviewId)
  if (success) {
    revalidatePath("/admin/reviews")
    if (productId) {
      revalidatePath(`/admin/reviews/detail-reviews/${productId}`)
    }
  }
  return success
}

export async function createCustomReviewAction(data: {
  productId: number
  reviewerName: string
  reviewerImage?: string
  rating: number
  comment: string
}): Promise<boolean> {
  const success = await createCustomReview(data)
  if (success) {
    revalidatePath("/admin/reviews")
    revalidatePath(`/admin/reviews/detail-reviews/${data.productId}`)
    revalidatePath("/(shop)")
  }
  return success
}
