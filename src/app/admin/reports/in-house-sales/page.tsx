import React from "react"
import { getInhouseSalesReport } from "@/services/report-service"
import { getCategories } from "@/services/category-service"
import { InhouseSalesReportView } from "./_components/inhouse-sales-report-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Inhouse Product Sale Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ category_id?: string }>
}

export default async function AdminInhouseSalesReportPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryId = params.category_id ? parseInt(params.category_id, 10) : undefined

  const [products, categories] = await Promise.all([
    getInhouseSalesReport(categoryId),
    getCategories(),
  ])

  return (
    <InhouseSalesReportView
      products={products}
      categories={categories}
      currentCategoryId={categoryId}
    />
  )
}
