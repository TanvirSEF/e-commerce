import React from "react"
import { getCurrentSeller, getSellerCoupons } from "@/services/seller-panel-service"
import { SellerCouponsView } from "./_components/seller-coupons-view"

export const dynamic = "force-dynamic"
export const metadata = { title: "My Coupons | Seller Dashboard" }

export default async function SellerCouponsPage() {
  const seller = await getCurrentSeller()
  const coupons = await getSellerCoupons(seller?.userId ?? null)
  return (
    <div className="p-4 md:p-6">
      <SellerCouponsView initialCoupons={coupons} />
    </div>
  )
}
