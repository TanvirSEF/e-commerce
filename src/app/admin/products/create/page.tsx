import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { AdminProductCreateView } from "./_components/admin-product-create-view"

export const metadata: Metadata = {
  title: "Add New Product | Admin Control Panel",
  description: "Create and publish a new product to store catalog",
}

export default async function AdminProductCreatePage() {
  const categories = await getCategories()
  const brands = await getBrands()

  return (
    <AdminProductCreateView
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
    />
  )
}
