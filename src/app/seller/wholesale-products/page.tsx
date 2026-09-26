import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { SellerWholesaleView } from "./_components/seller-wholesale-view"

export const metadata: Metadata = {
  title: "Wholesale Pricing | Seller Central",
  description: "Configure volume discount brackets for bulk purchasers",
}

export default async function SellerWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("seller")

  return (
    <div className="p-4 md:p-6">
      <SellerWholesaleView initialProducts={products} />
    </div>
  )
}
