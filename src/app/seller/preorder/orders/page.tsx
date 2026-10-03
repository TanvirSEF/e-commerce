import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getAllPreorderOrders } from "@/services/preorder-service"
import { SellerPreorderOrdersView } from "./_components/seller-preorder-orders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pre-Order Bookings | Seller Central",
  description: "View customer pre-order deposits and reservations",
}

export default async function SellerPreorderOrdersPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  let orders = await getAllPreorderOrders("all", sellerData.shop.name)
  if (orders.length === 0) {
    orders = await getAllPreorderOrders("all")
  }

  return (
    <div className="p-4 md:p-6">
      <SellerPreorderOrdersView initialOrders={orders} />
    </div>
  )
}
