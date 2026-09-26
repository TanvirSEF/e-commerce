import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { WholesaleProductsView } from "../all-products/_components/wholesale-products-view"

export const metadata: Metadata = {
  title: "Seller Wholesale Products | Admin Dashboard",
  description: "Manage merchant bulk pricing brackets",
}

export default async function AdminSellerWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("seller")

  return (
    <div className="p-4 md:p-6">
      <WholesaleProductsView initialProducts={products} filterType="seller" />
    </div>
  )
}
