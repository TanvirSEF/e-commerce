import React from "react"
import { Metadata } from "next"
import { getAdminOrdersList } from "@/services/admin-orders-service"
import { OfflinePaymentsAdminView } from "./_components/offline-payments-admin-view"

export const metadata: Metadata = {
  title: "Offline Payment Orders | Active eCommerce Admin",
  description: "Audit customer offline bank deposits, bKash/Nagad TrxIDs, and approve payments",
}

export const dynamic = "force-dynamic"

export default async function AdminOfflinePaymentsPage() {
  // Fetch real database offline payment orders directly from PostgreSQL (Zero mock data)
  const initialData = await getAdminOrdersList({
    offlinePaymentOnly: true,
    limit: 15,
    page: 1,
  })

  return <OfflinePaymentsAdminView initialData={initialData} />
}
