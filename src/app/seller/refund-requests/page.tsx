import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getRefundsAdminWithPagination } from "@/services/refund-service"
import { SellerRefundRequestsView } from "./_components/seller-refund-requests-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Received Refund Requests | Seller Portal",
}

export default async function SellerRefundRequestsPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const { items, stats } = await getRefundsAdminWithPagination({
    shopId: sellerData.shop.id,
    limit: 50,
  })

  return (
    <div className="p-4 md:p-6">
      <SellerRefundRequestsView
        initialRefunds={items}
        stats={stats}
      />
    </div>
  )
}
