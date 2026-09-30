import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { WholesaleProductsView } from "./_components/wholesale-products-view"

export const metadata: Metadata = {
  title: "All Wholesale Products | Active eCommerce Admin",
  description: "Manage B2B wholesale pricing tiers and volume discounts in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function AdminAllWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("all")

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WholesaleProductsView initialProducts={products} filterType="all" />
    </div>
  )
}
