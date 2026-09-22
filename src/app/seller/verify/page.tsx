import React from "react"
import { getShopBySlug } from "@/services/shop-service"
import { SellerVerifyView } from "./_components/seller-verify-view"

export const metadata = {
  title: "Shop Verification | Seller Dashboard",
}

export default async function SellerVerifyPage() {
  const shop = await getShopBySlug("active-fashion-outlet")

  return <SellerVerifyView shop={shop} />
}
