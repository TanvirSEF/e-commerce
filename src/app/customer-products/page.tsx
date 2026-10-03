import React from "react"
import type { Metadata } from "next"
import { getPublishedCustomerProducts } from "@/services/customer-product-service"
import { getCustomerProductsCategoryTree } from "@/services/category-service"
import { getBrands } from "@/services/brand-service"
import { CustomerProductsView } from "./_components/customer-products-view"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    condition?: string
    sort_by?: string
    page?: string
    q?: string
  }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const categoryTitle = params.category
    ? params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "All Categories"

  return {
    title: `${categoryTitle} | Customer Products | Active eCommerce`,
    description: "Browse verified customer second-hand products, used smartphones, laptops, electronics, and vehicles.",
  }
}

export default async function CustomerProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || "1", 10) || 1

  const [productsData, categoryTree, brands] = await Promise.all([
    getPublishedCustomerProducts({
      category: params.category,
      brand: params.brand,
      condition: params.condition,
      sort: params.sort_by,
      search: params.q,
      page: currentPage,
      limit: 12,
    }),
    getCustomerProductsCategoryTree(params.category),
    getBrands(),
  ])

  return (
    <CustomerProductsView
      products={productsData.products}
      total={productsData.total}
      currentPage={productsData.page}
      totalPages={productsData.totalPages}
      categoryTree={categoryTree}
      brands={brands}
    />
  )
}
