import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerPosSales } from "@/services/pos-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerPosOrdersView } from "./_components/seller-pos-orders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Vendor POS Orders | Seller Console",
  description: "View walk-in store POS transactions",
}

export default async function SellerPosOrdersPage() {
  await ensureAddonActivated("pos_system")

  // Resolve logged-in seller shop
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id
  // Query 100% real PostgreSQL POS orders for this seller
  const sales = await getSellerPosSales(shopId)

  return (
    <div className="p-4 md:p-6">
      <SellerPosOrdersView initialSales={sales} />
    </div>
  )
}
