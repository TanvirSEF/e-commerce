import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerAuctionOrders } from "@/services/auction-service"
import { SellerAuctionOrdersView } from "./_components/seller-auction-orders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Auction Orders | Seller Panel",
}

export default async function SellerAuctionOrdersPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const sellerSlug = sellerData?.shop?.slug || "active-fashion-outlet"
  let orders = await getSellerAuctionOrders(sellerSlug)
  if (orders.length === 0) {
    orders = await getSellerAuctionOrders()
  }

  return (
    <div className="p-4 md:p-6">
      <SellerAuctionOrdersView orders={orders} />
    </div>
  )
}
