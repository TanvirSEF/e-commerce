import React from "react"
import type { Metadata } from "next"
import { getAllSizeCharts } from "@/services/size-chart-service"
import { getCategories } from "@/services/category-service"
import { SizeChartsListView } from "./_components/size-charts-list-view"
import type { SizeChartDetailItem } from "./_components/size-chart-detail-modal"

export const metadata: Metadata = {
  title: "All Size Chart | Admin | Active eCommerce CMS",
  description: "Manage product size charts and measurement guides in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function SizeChartsPage() {
  const [charts, categories] = await Promise.all([
    getAllSizeCharts(),
    getCategories(),
  ])

  const enrichedCharts: SizeChartDetailItem[] = charts.map((c) => {
    const cat = categories.find((cat) => Number(cat.id) === c.categoryId)
    return {
      id: c.id,
      name: c.name,
      categoryId: c.categoryId,
      categoryName: cat ? cat.name : "—",
      fitType: c.fitType || "Regular",
      stretchType: "Slight",
      unit: c.unit || "in",
      measurements: c.measurements || [],
    }
  })

  return <SizeChartsListView initialCharts={enrichedCharts} />
}
