import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { AdminPreorderCreateView } from "./_components/admin-preorder-create-view"

export const metadata: Metadata = {
  title: "Add New Product | Admin Dashboard",
  description: "Create a new preorder product with advance booking deposit and target launch delivery date",
}

export default async function AdminPreorderCreatePage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminPreorderCreateView
        categories={(categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        brands={(brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
      />
    </div>
  )
}
