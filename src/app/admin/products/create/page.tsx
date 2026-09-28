import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { getProductForEdit } from "@/services/product-service"
import { AdminProductCreateView } from "./_components/admin-product-create-view"

export const metadata: Metadata = {
  title: "Product Editor | Admin Control Panel",
  description: "Create and publish or update a product in store catalog",
}

export default async function AdminProductCreatePage(props: {
  searchParams: Promise<{ edit?: string }>
}) {
  const searchParams = await props.searchParams
  const editId = searchParams?.edit

  const [categories, brands, initialProduct] = await Promise.all([
    getCategories(),
    getBrands(),
    editId ? getProductForEdit(editId) : Promise.resolve(null),
  ])

  return (
    <AdminProductCreateView
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
      initialProduct={initialProduct}
    />
  )
}

