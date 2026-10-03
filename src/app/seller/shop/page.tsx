import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerShop } from "@/services/seller-panel-service"
import { SellerShopView } from "./_components/seller-shop-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Shop Settings | Seller Dashboard",
  description: "Configure store identity, branding, banners, and social links",
}

export default async function SellerShopPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const shop = await getSellerShop(seller.shopId)
  if (!shop) {
    redirect("/seller/dashboard")
  }

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-5">
      <SellerShopView shop={shop} />
    </div>
  )
}
