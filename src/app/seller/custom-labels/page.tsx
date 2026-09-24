import React from "react"
import { Metadata } from "next"
import { getCustomLabels } from "@/services/custom-label-service"
import { SellerCustomLabelsView } from "./_components/seller-custom-labels-view"

export const metadata: Metadata = {
  title: "Custom Labels & Badges | Seller Console",
  description: "View approved product ribbons and custom badges for store merchandising",
}

export default async function SellerCustomLabelsPage() {
  const allLabels = await getCustomLabels()
  // Filter labels where sellerAccess is true or userType is seller
  const sellerLabels = allLabels.filter((l) => l.sellerAccess || l.userType === "seller")

  return (
    <div className="p-4 md:p-6">
      <SellerCustomLabelsView labels={sellerLabels} />
    </div>
  )
}
