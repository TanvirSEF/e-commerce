import React from "react"
import { Metadata } from "next"
import { getAllSellersAdmin } from "@/services/seller-service"
import { getSellerCommissionOverrides } from "@/services/settings-service"
import { SellerBasedCommissionView } from "./_components/seller-based-commission-view"

export const metadata: Metadata = {
  title: "Seller Commission | Admin Dashboard",
  description: "Configure individual vendor commission rates and overrides",
}

export default async function AdminSellerCommissionPage() {
  const [{ sellers }, overrides] = await Promise.all([
    getAllSellersAdmin(),
    getSellerCommissionOverrides(),
  ])

  return (
    <div className="p-4 md:p-6">
      <SellerBasedCommissionView
        sellers={sellers}
        initialOverrides={overrides}
      />
    </div>
  )
}
