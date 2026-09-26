import React from "react"
import { Metadata } from "next"
import { getAllSellerPackages } from "@/services/package-service"
import { SellerPackagesView } from "./_components/seller-packages-view"

export const metadata: Metadata = {
  title: "Seller Packages | Admin Dashboard",
  description: "Configure multi-tier seller subscription plans",
}

export default async function AdminSellerPackagesPage() {
  const packages = await getAllSellerPackages()

  return (
    <div className="p-4 md:p-6">
      <SellerPackagesView initialPackages={packages} />
    </div>
  )
}
