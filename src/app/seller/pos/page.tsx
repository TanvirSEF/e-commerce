import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerPosProducts, getPosCustomers } from "@/services/pos-service"
import { getCategories } from "@/services/category-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { SellerPosView } from "./_components/seller-pos-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "POS Register | Seller Console",
  description: "Point of sale register for walk-in retail counter",
}

export default async function SellerPosPage() {
  await ensureAddonActivated("pos_system")

  // Resolve logged-in seller shop
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id
  const shopName = sellerData.shop.name
  const shopSlug = sellerData.shop.slug

  // Concurrently fetch real PostgreSQL data
  const [products, categories, customers] = await Promise.all([
    getSellerPosProducts({ shopId }),
    getCategories(),
    getPosCustomers(),
  ])

  return (
    <div className="p-4 md:p-6">
      <SellerPosView
        products={products}
        categories={categories}
        customers={customers}
        sellerInfo={{
          shopId,
          shopName,
          shopSlug,
        }}
      />
    </div>
  )
}
