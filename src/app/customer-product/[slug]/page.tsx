import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCustomerProductBySlug } from "@/services/customer-product-service"
import { CustomerProductDetailView } from "@/app/customer-products/[id]/_components/customer-product-detail-view"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getCustomerProductBySlug(slug)

  if (!product) {
    return {
      title: "Classified Product Not Found | Active eCommerce",
    }
  }

  return {
    title: `${product.name} | Classified Ads | Active eCommerce`,
    description: product.name,
  }
}

export default async function CustomerProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getCustomerProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <CustomerProductDetailView product={product} />
}
