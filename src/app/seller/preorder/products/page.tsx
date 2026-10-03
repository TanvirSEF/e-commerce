import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getAllPreorderProducts } from "@/services/preorder-service"
import { SellerPreorderProductsView } from "./_components/seller-preorder-products-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pre-Order Products | Seller Central",
  description: "Manage upcoming vendor release pre-orders",
}

export default async function SellerPreorderProductsPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  // Get products for this seller shop
  let products = await getAllPreorderProducts(sellerData.shop.slug)
  if (products.length === 0) {
    products = await getAllPreorderProducts()
  }

  return (
    <div className="p-4 md:p-6">
      <SellerPreorderProductsView
        initialProducts={products}
        sellerSlug={sellerData.shop.slug || "inhouse"}
      />
    </div>
  )
}
