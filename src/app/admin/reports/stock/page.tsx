import React from "react"
import { getStockReport } from "@/services/report-service"
import { getCategories } from "@/services/category-service"
import { StockReportView } from "./_components/stock-report-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Product Wise Stock Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ category_id?: string }>
}

export default async function AdminStockReportPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryId = params.category_id ? parseInt(params.category_id, 10) : undefined

  const [products, categories] = await Promise.all([
    getStockReport(categoryId),
    getCategories(),
  ])

  return (
    <StockReportView
      products={products}
      categories={categories}
      currentCategoryId={categoryId}
    />
  )
}
