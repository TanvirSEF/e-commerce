import React from "react"
import { Metadata } from "next"
import { getDigitalProductsAdmin } from "@/services/product-service"
import { DigitalProductsView } from "./_components/digital-products-view"

export const metadata: Metadata = {
  title: "Digital Products | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function AdminDigitalProductsPage({ searchParams }: PageProps) {
  const { search } = await searchParams
  const products = await getDigitalProductsAdmin(search)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <DigitalProductsView initialProducts={products} />
    </div>
  )
}
