import React from "react"
import { Metadata } from "next"
import { getAllPreorderOrders } from "@/services/preorder-service"
import { SellerPreorderOrdersView } from "./_components/seller-preorder-orders-view"

export const metadata: Metadata = {
  title: "Pre-Order Bookings | Seller Central",
  description: "View customer pre-order deposits and reservations",
}

export default async function SellerPreorderOrdersPage() {
  const orders = await getAllPreorderOrders("all")

  return (
    <div className="p-4 md:p-6">
      <SellerPreorderOrdersView initialOrders={orders} />
    </div>
  )
}
