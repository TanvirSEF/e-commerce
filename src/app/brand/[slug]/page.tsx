import React from "react"
import type { Metadata } from "next"
import ProductsPage from "@/app/products/page"

interface BrandPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params
  const brandTitle = slug.replace(/-/g, " ")
  return {
    title: `${brandTitle.charAt(0).toUpperCase() + brandTitle.slice(1)} Products | Active eCommerce`,
    description: `Shop authentic items from ${brandTitle} with verified brand warranty and express delivery.`,
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params
  return <ProductsPage searchParams={Promise.resolve({ brand: slug })} />
}
