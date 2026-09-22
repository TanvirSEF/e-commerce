import React from "react"
import { getCoupons } from "@/services/coupon-service"
import { SellerCouponsView } from "./_components/seller-coupons-view"

export const metadata = { title: "My Coupons | Seller Dashboard" }

export default async function SellerCouponsPage() {
  const coupons = await getCoupons()
  return <SellerCouponsView initialCoupons={coupons} />
}
