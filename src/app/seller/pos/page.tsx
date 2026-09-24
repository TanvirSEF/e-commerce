import React from "react"
import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { getCategories } from "@/services/category-service"
import { SellerPosView } from "./_components/seller-pos-view"

export const metadata: Metadata = {
  title: "POS Register | Seller Console",
  description: "Point of sale register for walk-in retail counter",
}

export default async function SellerPosPage() {
  const [{ data: products }, categories] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
  ])

  return (
    <div className="p-4 md:p-6">
      <SellerPosView products={products} categories={categories} />
    </div>
  )
}
