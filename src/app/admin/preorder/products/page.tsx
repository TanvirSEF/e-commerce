import React from "react"
import { Metadata } from "next"
import { getAllPreorderProducts } from "@/services/preorder-service"
import { AdminPreorderProductsView } from "./_components/admin-preorder-products-view"

export const metadata: Metadata = {
  title: "Pre-Order Products | Admin Dashboard",
  description: "Manage upcoming release products, booking quotas, and advance deposits",
}

export default async function AdminPreorderProductsPage() {
  const products = await getAllPreorderProducts()

  return (
    <div className="p-4 md:p-6">
      <AdminPreorderProductsView initialProducts={products} />
    </div>
  )
}
