import React from "react"
import { getOrdersAdmin } from "@/services/order-service"
import { SellerOrdersView } from "./_components/seller-orders-view"

export const metadata = {
  title: "My Orders | Seller Dashboard",
}

export default async function SellerOrdersPage() {
  const { orders } = await getOrdersAdmin({ limit: 30 })

  return <SellerOrdersView initialOrders={orders} />
}
