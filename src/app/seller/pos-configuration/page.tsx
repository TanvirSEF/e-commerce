import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getPosConfig } from "@/services/pos-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerPosConfigView } from "./_components/seller-pos-config-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "POS Configuration | Seller Console",
  description: "Configure seller POS terminal and thermal print settings",
}

export default async function SellerPosConfigPage() {
  await ensureAddonActivated("pos_system")

  // Resolve logged-in seller shop
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id
  const shopName = sellerData.shop.name

  // Fetch PostgreSQL persisted configuration for this seller
  const config = await getPosConfig(shopId)

  return (
    <div className="p-4 md:p-6">
      <SellerPosConfigView
        initialConfig={config}
        shopId={shopId}
        shopName={shopName}
      />
    </div>
  )
}
