import React from "react"
import { Metadata } from "next"
import { getCustomProductVisitorsSettings } from "@/services/settings-service"
import { CustomProductVisitorsView } from "./_components/custom-product-visitors-view"

export const metadata: Metadata = {
  title: "Custom Product Visitors | Marketing | Admin Panel",
  description: "Configure simulated live visitor count on product detail pages",
}

export default async function CustomProductVisitorsPage() {
  const settings = await getCustomProductVisitorsSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <CustomProductVisitorsView initialSettings={settings} />
    </div>
  )
}
