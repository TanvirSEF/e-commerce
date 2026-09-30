import React from "react"
import { Metadata } from "next"
import { getPreorderOrdersAdmin } from "@/services/preorder-service"
import { AdminPreorderOrdersView } from "./_components/admin-preorder-orders-view"

export const metadata: Metadata = {
  title: "All Preorders | Admin Control Panel",
  description: "Manage pre-order customer reservations, prepayment deposits, and dispatching",
}

interface AdminPreorderOrdersPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
  }>
}

export default async function AdminPreorderOrdersPage(props: AdminPreorderOrdersPageProps) {
  const searchParams = await props.searchParams
  const status = searchParams.status || "all"
  const search = searchParams.search || ""
  const page = Number(searchParams.page) || 1

  const { orders, counts } = await getPreorderOrdersAdmin({
    status,
    search,
    page,
    limit: 25,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminPreorderOrdersView initialOrders={orders} counts={counts} />
    </div>
  )
}
