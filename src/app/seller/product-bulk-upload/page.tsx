import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { SellerBulkUploadView } from "./_components/seller-bulk-upload-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Product Bulk Upload | Seller Console",
  description: "Upload and batch import products via CSV into your shop catalog",
}

export default async function SellerBulkUploadPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  const formattedBrands = brands.map((b) => ({
    id: b.id,
    name: b.name,
  }))

  return (
    <div className="p-4 md:p-6">
      <SellerBulkUploadView
        categories={formattedCategories}
        brands={formattedBrands}
        shopId={sellerData.shop.id}
      />
    </div>
  )
}
