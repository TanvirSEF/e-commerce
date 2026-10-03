import React from "react"
import { Metadata } from "next"
import { getSellerVisibleLabels } from "@/services/seller-panel-service"
import { SellerCustomLabelsView } from "./_components/seller-custom-labels-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Custom Labels & Badges | Seller Console",
  description: "View approved product ribbons and custom badges for store merchandising",
}

export default async function SellerCustomLabelsPage() {
  const labels = await getSellerVisibleLabels()

  return (
    <div className="p-4 md:p-6">
      <SellerCustomLabelsView labels={labels} />
    </div>
  )
}
