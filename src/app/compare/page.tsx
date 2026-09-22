import React from "react"
import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { CompareView } from "./_components/compare-view"

export const metadata: Metadata = {
  title: "Compare Products | Active eCommerce",
  description: "Compare product specifications, prices, and features side-by-side",
}

export default async function ComparePage() {
  // Provide sample comparative products by default
  const { data } = await getProducts({ limit: 4 })

  const initialItems = data.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    thumbnail: p.thumbnail,
    category: p.categorySlug.replace(/-/g, " ").toUpperCase(),
    brand: p.brandSlug.toUpperCase(),
    rating: p.rating,
  }))

  return <CompareView initialItems={initialItems} />
}
