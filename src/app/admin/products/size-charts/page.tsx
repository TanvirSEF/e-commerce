import React from "react"
import type { Metadata } from "next"
import { getAllSizeCharts } from "@/services/size-chart-service"
import { SizeChartsListView } from "./_components/size-charts-list-view"

export const metadata: Metadata = {
  title: "Product Size Charts | Admin | Active eCommerce",
  description: "Manage product size charts and measurement guides in Active eCommerce CMS",
}

export default async function SizeChartsPage() {
  const charts = await getAllSizeCharts()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <SizeChartsListView initialCharts={charts} />
    </div>
  )
}
