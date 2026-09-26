import React from "react"
import { Metadata } from "next"
import { getAllPreorderOrders } from "@/services/preorder-service"
import { AdminPreorderOrdersView } from "./_components/admin-preorder-orders-view"

export const metadata: Metadata = {
  title: "Pre-Order Reservations | Admin Dashboard",
  description: "Track customer pre-order deposits and booking balances",
}

export default async function AdminPreorderOrdersPage() {
  const orders = await getAllPreorderOrders("all")

  return (
    <div className="p-4 md:p-6">
      <AdminPreorderOrdersView initialOrders={orders} />
    </div>
  )
}
