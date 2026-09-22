import React from "react"
import { getOfflineOrdersAdmin } from "@/services/order-service"
import { OfflinePaymentsAdminView } from "./_components/offline-payments-admin-view"

export const metadata = {
  title: "Offline Payments Desk | Active eCommerce Admin",
}

export default async function AdminOfflinePaymentsPage() {
  const orders = await getOfflineOrdersAdmin()

  return <OfflinePaymentsAdminView initialOrders={orders} />
}
