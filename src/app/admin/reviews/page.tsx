import React from "react"
import { Metadata } from "next"
import {
  getProductReviewsAdmin,
  getSellersForReviewFilter,
} from "@/services/review-service"
import { ReviewsAdminView } from "./_components/reviews-admin-view"

export const metadata: Metadata = {
  title: "All Rating & Reviews | Active eCommerce CMS",
  description: "Manage product ratings, customer feedback, and custom reviews in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function AdminReviewsPage() {
  const [initialData, sellers] = await Promise.all([
    getProductReviewsAdmin({ page: 1, limit: 15 }),
    getSellersForReviewFilter(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ReviewsAdminView initialData={initialData} sellers={sellers} />
    </div>
  )
}
