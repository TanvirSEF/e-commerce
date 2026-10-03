import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { SellerAuctionCreateView } from "./_components/seller-auction-create-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Create Auction Product | Seller Panel",
}

export default async function SellerAuctionCreatePage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const sellerSlug = sellerData?.shop?.slug || "active-fashion-outlet"
  const sellerName = sellerData?.shop?.name || "Active Fashion Outlet"

  return (
    <div className="p-4 md:p-6">
      <SellerAuctionCreateView sellerSlug={sellerSlug} sellerName={sellerName} />
    </div>
  )
}
