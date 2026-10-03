import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerDigitalProducts } from "@/services/product-service"
import { SellerDigitalProductsView } from "./_components/seller-digital-products-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Digital Products | Seller Merchant Panel",
  description: "Manage digital downloads, software licenses, ebooks, and media assets",
}

export default async function SellerDigitalProductsPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const products = await getSellerDigitalProducts(sellerData.shop.id)

  return <SellerDigitalProductsView initialProducts={products} />
}
