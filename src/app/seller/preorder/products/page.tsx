import React from "react"
import { Metadata } from "next"
import { getAllPreorderProducts } from "@/services/preorder-service"
import { SellerPreorderProductsView } from "./_components/seller-preorder-products-view"

export const metadata: Metadata = {
  title: "Pre-Order Products | Seller Central",
  description: "Manage upcoming vendor release pre-orders",
}

export default async function SellerPreorderProductsPage() {
  const products = await getAllPreorderProducts()

  return (
    <div className="p-4 md:p-6">
      <SellerPreorderProductsView initialProducts={products} />
    </div>
  )
}
