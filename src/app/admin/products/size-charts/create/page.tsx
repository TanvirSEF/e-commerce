import React from "react"
import type { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getAllMeasurementPoints } from "@/services/size-chart-service"
import { getAllAttributes } from "@/services/attribute-service"
import { SizeChartCreateView } from "./_components/size-chart-create-view"

export const metadata: Metadata = {
  title: "Add New Size Chart | Admin | Active eCommerce",
  description: "Create product size chart in Active eCommerce CMS",
}

export default async function SizeChartCreatePage() {
  const [categories, measurementPoints, attributes] = await Promise.all([
    getCategories(),
    getAllMeasurementPoints(),
    getAllAttributes(),
  ])

  // Extract size options from "Size" attribute or collect all unique sizes
  const sizeAttr = attributes.find(
    (a) => a.name.toLowerCase() === "size" || a.name.toLowerCase().includes("size")
  )
  const initialSizes =
    sizeAttr && sizeAttr.values.length > 0
      ? sizeAttr.values
      : ["S", "M", "L", "XL", "XXL", "3XL"]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <SizeChartCreateView
        categories={categories.map((c) => ({
          id: String(c.id),
          name: c.name,
          parentId: c.parentId ? String(c.parentId) : undefined,
        }))}
        measurementPoints={measurementPoints.map((m) => ({
          id: m.id,
          name: m.name,
        }))}
        initialSizes={initialSizes}
      />
    </div>
  )
}
