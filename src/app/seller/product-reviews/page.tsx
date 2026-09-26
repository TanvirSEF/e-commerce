import React from "react"
import { Metadata } from "next"
import { SellerReviewsView } from "./_components/seller-reviews-view"

export const metadata: Metadata = {
  title: "Product Reviews | Seller Merchant Panel",
  description: "View ratings and customer reviews across your store catalog",
}

export default function SellerReviewsPage() {
  return <SellerReviewsView />
}
