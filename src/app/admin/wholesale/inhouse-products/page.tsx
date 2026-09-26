import React from "react"
import { Metadata } from "next"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { WholesaleProductsView } from "../all-products/_components/wholesale-products-view"

export const metadata: Metadata = {
  title: "In-House Wholesale Products | Admin Dashboard",
  description: "Manage in-house bulk pricing brackets",
}

export default async function AdminInhouseWholesaleProductsPage() {
  const products = await getAllWholesaleProducts("inhouse")

  return (
    <div className="p-4 md:p-6">
      <WholesaleProductsView initialProducts={products} filterType="inhouse" />
    </div>
  )
}
