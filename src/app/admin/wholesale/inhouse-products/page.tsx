import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { WholesaleProductsView } from "../all-products/_components/wholesale-products-view"

export const metadata: Metadata = {
  title: "In-House Wholesale Products | Active eCommerce Admin",
  description: "Manage in-house bulk pricing brackets in Active eCommerce CMS",
}

export const dynamic = "force-dynamic"

export default async function AdminInhouseWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("inhouse")

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WholesaleProductsView initialProducts={products} filterType="inhouse" />
    </div>
  )
}
