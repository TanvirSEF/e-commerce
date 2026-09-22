import React from "react"
import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { AdminProductsView, AdminProductRow } from "./_components/admin-products-view"

export const metadata: Metadata = {
  title: "All Products | Admin Control Panel",
  description: "View, filter, and manage store product catalog",
}

export default async function AdminProductsPage() {
  const { data } = await getProducts({ limit: 50, sort: "newest" })

  const initialProducts: AdminProductRow[] = data.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categorySlug.replace(/-/g, " ").toUpperCase(),
    brand: p.brandSlug.toUpperCase(),
    price: p.price,
    stock: p.stock,
    salesCount: p.salesCount,
    published: true,
    featured: p.featured,
    thumbnail: p.thumbnail,
  }))

  return <AdminProductsView initialProducts={initialProducts} />
}
