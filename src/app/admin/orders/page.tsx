import React from "react"
import { Metadata } from "next"
import { getAdminOrdersList } from "@/services/admin-orders-service"
import { AdminOrdersView } from "./_components/admin-orders-view"

export const metadata: Metadata = {
  title: "All Orders | Admin Control Panel",
  description: "Track and update customer orders and shipment statuses",
}

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    tab?: "all" | "inhouse" | "seller" | "pickup_point"
    search?: string
    delivery_status?: string
    payment_status?: string
    page?: string
  }>
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tab = params.tab || "all"
  const search = params.search || ""
  const deliveryStatuses = params.delivery_status ? [params.delivery_status] : []
  const paymentStatus = params.payment_status || ""
  const page = Number(params.page || 1)

  // Fetch real database orders directly from PostgreSQL (Zero mock data)
  const initialData = await getAdminOrdersList({
    tab,
    search,
    deliveryStatuses,
    paymentStatus,
    page,
    limit: 15,
  })

  return (
    <AdminOrdersView
      initialData={initialData}
      initialTab={tab}
      initialSearch={search}
      initialDeliveryStatuses={deliveryStatuses}
      initialPaymentStatus={paymentStatus}
    />
  )
}

