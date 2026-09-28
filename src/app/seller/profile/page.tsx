import React from "react"
import { getShopBySlug } from "@/services/shop-service"
import { SellerProfileView } from "./_components/seller-profile-view"

export const metadata = {
  title: "Manage Profile | Seller Dashboard",
}

export default async function SellerProfilePage() {
  const shop = await getShopBySlug("active-fashion-outlet")

  return <SellerProfileView shop={shop} />
}
