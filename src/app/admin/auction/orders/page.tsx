import React from "react"
import { getAllAuctionOrders } from "@/services/auction-service"
import { AdminAuctionOrdersView } from "./_components/admin-auction-orders-view"

export const metadata = {
  title: "Auction Orders & Sales | Admin Panel",
}

export default async function AdminAuctionOrdersPage() {
  const orders = await getAllAuctionOrders()
  return <AdminAuctionOrdersView orders={orders} />
}
