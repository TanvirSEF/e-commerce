import React from "react"
import type { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { SizeChartCreateView } from "./_components/size-chart-create-view"

export const metadata: Metadata = {
  title: "Create Size Chart | Admin | Active eCommerce",
  description: "Create product size chart in Active eCommerce CMS",
}

export default async function SizeChartCreatePage() {
  const categories = await getCategories()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <SizeChartCreateView
        categories={categories.map((c) => ({
          id: String(c.id),
          name: c.name,
        }))}
      />
    </div>
  )
}
