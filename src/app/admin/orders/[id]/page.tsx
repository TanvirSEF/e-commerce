import React from "react"
import { notFound } from "next/navigation"
import { getOrderByIdAdmin } from "@/services/order-service"
import { OrderDetailsAdminView } from "./_components/order-details-admin-view"

export const metadata = {
  title: "Order Details | Active eCommerce Admin",
}

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  const order = await getOrderByIdAdmin(id)

  if (!order) {
    notFound()
  }

  return <OrderDetailsAdminView order={order} />
}
