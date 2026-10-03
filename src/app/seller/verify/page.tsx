import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerShop } from "@/services/seller-panel-service"
import { SellerVerifyView } from "./_components/seller-verify-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Shop Verification | Seller Dashboard",
  description: "Apply for store verification and submit business identification documents",
}

export default async function SellerVerifyPage() {
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
      <SellerVerifyView shop={shop} />
    </div>
  )
}
