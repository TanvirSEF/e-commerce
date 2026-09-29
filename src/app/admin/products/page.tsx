import React from "react"
import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { getCategories } from "@/services/category-service"
import { AdminProductsView, type AdminProductRowData } from "./_components/admin-products-view"

export const metadata: Metadata = {
  title: "All Products | Admin Control Panel",
  description: "View, filter, and manage store product catalog",
}

export default async function AdminProductsPage() {
  const [{ data, total }, categories] = await Promise.all([
    getProducts({ limit: 100, sort: "newest", includeUnpublished: true }),
    getCategories(),
  ])

  const initialProducts: AdminProductRowData[] = data.map((p) => {
    const matchedCat = categories.find((c) => c.slug === p.categorySlug)
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: matchedCat?.name || p.categorySlug.replace(/-/g, " ").toUpperCase(),
      brand: p.brandSlug ? p.brandSlug.toUpperCase() : "GENERAL",
      price: p.price,
      stock: p.stock,
      salesCount: p.salesCount || 0,
      published: p.published !== false,
      featured: p.featured,
      todaysDeal: p.todaysDeal,
      addedBy: p.addedBy || "admin",
      thumbnail: p.thumbnail || "/assets/img/placeholder.jpg",
    }
  })

  return (
    <div className="p-4 md:p-6">
      <AdminProductsView
        initialProducts={initialProducts}
        categories={categories}
        totalCount={total}
      />
    </div>
  )
}
