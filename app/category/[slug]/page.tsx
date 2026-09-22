import React from "react"
import type { Metadata } from "next"
import ProductsPage from "@/app/products/page"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryTitle = slug.replace(/-/g, " ")
  return {
    title: `${categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)} | Active eCommerce`,
    description: `Shop the best products in ${categoryTitle} with great discounts and fast delivery.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  return <ProductsPage searchParams={Promise.resolve({ category: slug })} />
}
