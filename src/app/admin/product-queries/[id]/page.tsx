import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getQueryById } from "@/services/product-query-service"
import { ProductQueryShowView } from "./_components/product-query-show-view"

export const metadata: Metadata = {
  title: "Product Query Details | Active eCommerce CMS",
  description: "View and respond to customer product inquiry",
}

export const dynamic = "force-dynamic"

interface ProductQueryShowPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminProductQueryShowPage({
  params,
}: ProductQueryShowPageProps) {
  const { id } = await params
  const numericId = parseInt(id, 10)

  if (!numericId || isNaN(numericId)) {
    notFound()
  }

  const query = await getQueryById(numericId)
  if (!query) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProductQueryShowView query={query} />
    </div>
  )
}
