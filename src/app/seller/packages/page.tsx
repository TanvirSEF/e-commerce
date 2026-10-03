import React from "react"
import { Metadata } from "next"
import { getCurrentSeller, getSellerPackageOverview } from "@/services/seller-panel-service"
import { SellerPackagesShopView } from "./_components/seller-packages-shop-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Subscription Packages | Seller Central",
  description: "Browse vendor subscription plans and product limits",
}

export default async function SellerPackagesPage() {
  const seller = await getCurrentSeller()
  const overview = seller ? await getSellerPackageOverview(seller) : { plans: [], current: null }

  return (
    <div className="p-4 md:p-6">
      <SellerPackagesShopView packages={overview.plans} current={overview.current} />
    </div>
  )
}
