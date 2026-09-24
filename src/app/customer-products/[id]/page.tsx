import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCustomerProductById } from "@/services/customer-product-service"
import { CustomerProductDetailView } from "./_components/customer-product-detail-view"

interface CustomerProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: CustomerProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getCustomerProductById(Number(id))

  if (!product) {
    return {
      title: "Classified Product Not Found | Active eCommerce",
    }
  }

  return {
    title: `${product.name} | Classified Ads | Active eCommerce`,
    description: product.description ? product.description.slice(0, 160) : product.name,
  }
}

export default async function CustomerProductDetailsPage({ params }: CustomerProductPageProps) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await getCustomerProductById(productId)

  if (!product) {
    notFound()
  }

  return <CustomerProductDetailView product={product} />
}
