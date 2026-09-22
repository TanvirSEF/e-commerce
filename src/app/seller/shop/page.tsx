import React from "react"
import { getShopBySlug } from "@/services/shop-service"
import { SellerShopView } from "./_components/seller-shop-view"

export const metadata = {
  title: "Shop Settings | Seller Dashboard",
}

export default async function SellerShopPage() {
  const shop = await getShopBySlug("active-fashion-outlet")

  return <SellerShopView shop={shop} />
}
