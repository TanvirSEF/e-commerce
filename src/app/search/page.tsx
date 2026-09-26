import React from "react"
import type { Metadata } from "next"
import ProductsPage from "@/app/products/page"

interface SearchPageProps {
  searchParams: Promise<{
    keyword?: string
    q?: string
    search?: string
    category?: string
    brand?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolved = await searchParams
  const query = resolved.keyword || resolved.q || resolved.search || ""
  return {
    title: query ? `Search results for "${query}" | Active eCommerce` : "Search Products | Active eCommerce",
    description: `Discover products matching "${query}" on Active eCommerce CMS with best deals and express delivery.`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams
  const keyword = resolved.keyword || resolved.q || resolved.search || ""

  return (
    <ProductsPage
      searchParams={Promise.resolve({
        keyword,
        category: resolved.category,
        brand: resolved.brand,
      })}
    />
  )
}
