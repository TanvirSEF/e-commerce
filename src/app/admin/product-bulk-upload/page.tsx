import React from "react"
import type { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { ProductBulkUploadView } from "./_components/product-bulk-upload-view"

export const metadata: Metadata = {
  title: "Product Bulk Upload | Admin | Active eCommerce",
  description: "Bulk upload products using CSV spreadsheets in Active eCommerce CMS",
}

export default async function ProductBulkUploadPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <ProductBulkUploadView
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
      />
    </div>
  )
}
