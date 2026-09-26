import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { WholesaleProductsView } from "./_components/wholesale-products-view"

export const metadata: Metadata = {
  title: "All Wholesale Products | Admin Dashboard",
  description: "Manage B2B wholesale pricing tiers and volume discounts",
}

export default async function AdminAllWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("all")

  return (
    <div className="p-4 md:p-6">
      <WholesaleProductsView initialProducts={products} filterType="all" />
    </div>
  )
}
