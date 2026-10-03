import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getAllWholesaleProducts } from "@/services/wholesale-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerWholesaleView } from "./_components/seller-wholesale-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Wholesale Pricing | Seller Central",
  description: "Configure volume discount brackets for bulk purchasers",
}

export default async function SellerWholesaleProductsPage() {
  await ensureAddonActivated("wholesale_system")

  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id
  const products = await getAllWholesaleProducts("seller", shopId)

  return (
    <div className="p-4 md:p-6">
      <SellerWholesaleView initialProducts={products} shopId={shopId} />
    </div>
  )
}
