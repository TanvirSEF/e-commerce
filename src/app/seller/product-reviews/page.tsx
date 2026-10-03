import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerProductReviewsList } from "@/services/seller-panel-service"
import { SellerReviewsView } from "./_components/seller-reviews-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "All Rating & Reviews | Seller Panel",
  description: "View customer feedback, reviews, and product ratings across your storefront",
}

export default async function SellerReviewsPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const reviewedProducts = await getSellerProductReviewsList(seller)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-4">
      <SellerReviewsView initialProducts={reviewedProducts} />
    </div>
  )
}
