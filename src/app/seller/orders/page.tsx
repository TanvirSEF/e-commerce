import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerOrders } from "@/services/order-service"
import { SellerOrdersView } from "./_components/seller-orders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Orders | Seller Dashboard",
}

export default async function SellerOrdersPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const { orders } = await getSellerOrders({
    shopId: sellerData.shop.id,
    userId: session?.user?.id,
    limit: 50,
  })

  return (
    <div className="p-4 md:p-6">
      <SellerOrdersView
        initialOrders={orders}
        shopName={sellerData.shop.name || "Active Fashion Outlet"}
      />
    </div>
  )
}
