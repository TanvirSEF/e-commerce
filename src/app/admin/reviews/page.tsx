import React from "react"
import { getAllReviewsAdmin } from "@/services/review-service"
import { ReviewsAdminView } from "./_components/reviews-admin-view"

export const metadata = {
  title: "Product Reviews | Active eCommerce Admin",
}

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin()

  return <ReviewsAdminView initialReviews={reviews} />
}
