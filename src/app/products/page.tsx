import React from "react"
import type { Metadata } from "next"
import { ProductCatalogView } from "./_components/product-catalog-view"
import { getProducts, getCatalogFilterFacets } from "@/lib/data-service"

export const metadata: Metadata = {
  title: "Products Catalog | Active eCommerce",
  description: "Browse all authentic products with exclusive deals, discounts, and nationwide delivery.",
}

export const dynamic = "force-dynamic"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    keyword?: string
    q?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams?.category || ""
  const brand = resolvedParams?.brand || ""
  const keyword = resolvedParams?.keyword || resolvedParams?.q || ""

  const [dbRes, facets] = await Promise.all([
    getProducts({
      q: keyword || undefined,
      limit: 200,
    }),
    getCatalogFilterFacets(),
  ])

  const products = dbRes.data.map((p) => ({
    ...p,
    categorySlug: p.categorySlug || "",
    categorySlugs: p.categorySlugs || (p.categorySlug ? [p.categorySlug] : []),
    brandSlug: p.brandSlug || "",
    colorName: p.colors?.[0]?.name,
  }))

  return (
    <ProductCatalogView
      initialProducts={products}
      initialCategory={category}
      initialBrand={brand}
      initialKeyword={keyword}
      facets={facets}
    />
  )
}
