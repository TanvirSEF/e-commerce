import React from "react"
import { getAllAuctionOrders } from "@/services/auction-service"
import { SellerAuctionOrdersView } from "./_components/seller-auction-orders-view"

export const metadata = {
  title: "Auction Orders | Seller Panel",
}

export default async function SellerAuctionOrdersPage() {
  const orders = await getAllAuctionOrders()
  return <SellerAuctionOrdersView orders={orders} />
}
