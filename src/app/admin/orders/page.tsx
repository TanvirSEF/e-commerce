import React from "react"
import { Metadata } from "next"
import { getAdminOrdersList } from "@/services/admin-orders-service"
import { AdminOrdersView } from "./_components/admin-orders-view"

export const metadata: Metadata = {
  title: "All Orders | Admin Control Panel",
  description: "Track and update customer orders and shipment statuses",
}

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  // Fetch real database orders directly from PostgreSQL (Zero mock data)
  const initialData = await getAdminOrdersList({ limit: 15, page: 1 })

  return <AdminOrdersView initialData={initialData} />
}
