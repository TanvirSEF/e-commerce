import React from "react"
import { Metadata } from "next"
import { getProductWishlistReport } from "@/services/report-service"
import { getCategories } from "@/services/category-service"
import { WishlistReportView } from "./_components/wishlist-report-view"

export const metadata: Metadata = {
  title: "Product Wish Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ category_id?: string }>
}

export default async function AdminWishlistReportPage({ searchParams }: PageProps) {
  const { category_id } = await searchParams
  const catId = category_id ? parseInt(category_id, 10) : undefined

  const [report, categories] = await Promise.all([
    getProductWishlistReport(catId),
    getCategories(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <WishlistReportView
        initialReport={report}
        categories={categories}
        currentCategoryId={catId}
      />
    </div>
  )
}
