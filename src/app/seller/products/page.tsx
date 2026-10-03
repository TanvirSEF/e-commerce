import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getProducts } from "@/services/product-service"
import { SellerProductsView } from "./_components/seller-products-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Products | Seller Dashboard",
  description: "Manage vendor catalog, inventory stock, published and featured status",
}

export default async function SellerProductsPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id

  // Fetch real PostgreSQL products for this seller
  const { data: products, total } = await getProducts({
    shopId,
    limit: 100,
    includeUnpublished: true,
  })

  return <SellerProductsView initialProducts={products} total={total} />
}
