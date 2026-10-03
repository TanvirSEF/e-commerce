import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerAuctionProducts } from "@/services/auction-service"
import { SellerAuctionProductsView } from "./_components/seller-auction-products-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "All Auction Products | Seller Panel",
}

export default async function SellerAuctionProductsPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const sellerSlug = sellerData?.shop?.slug || "active-fashion-outlet"
  let products = await getSellerAuctionProducts(sellerSlug)
  if (products.length === 0) {
    products = await getSellerAuctionProducts()
  }

  return (
    <div className="p-4 md:p-6">
      <SellerAuctionProductsView products={products} sellerSlug={sellerSlug} />
    </div>
  )
}
