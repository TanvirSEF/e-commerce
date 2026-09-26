import React from "react"
import { Metadata } from "next"
import { getAllSellerPackages } from "@/services/package-service"
import { SellerPackagesShopView } from "./_components/seller-packages-shop-view"

export const metadata: Metadata = {
  title: "Subscription Packages | Seller Central",
  description: "Browse vendor subscription plans and product limits",
}

export default async function SellerPackagesPage() {
  const packages = await getAllSellerPackages()

  return (
    <div className="p-4 md:p-6">
      <SellerPackagesShopView packages={packages.filter((p) => p.status)} />
    </div>
  )
}
