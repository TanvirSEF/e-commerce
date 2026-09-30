import React from "react"
import { Metadata } from "next"
import { getAuctionOrdersAdmin } from "@/services/auction-service"
import { AdminAuctionOrdersView } from "./_components/admin-auction-orders-view"

export const metadata: Metadata = {
  title: "Auction Orders & Sales | Admin Control Panel",
  description: "Fulfilled purchase orders generated from won auction events",
}

interface AdminAuctionOrdersPageProps {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function AdminAuctionOrdersPage(props: AdminAuctionOrdersPageProps) {
  const searchParams = await props.searchParams
  const search = searchParams.search || ""
  const page = Number(searchParams.page) || 1

  const { orders } = await getAuctionOrdersAdmin({
    search,
    page,
    limit: 25,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AdminAuctionOrdersView initialOrders={orders} />
    </div>
  )
}
