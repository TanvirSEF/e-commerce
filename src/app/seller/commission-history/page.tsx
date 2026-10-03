import React from "react"
import { Metadata } from "next"
import { getCurrentSeller, getSellerCommissionLedger } from "@/services/seller-panel-service"
import { getSellerCommissionSettings } from "@/services/settings-service"
import { SellerCommissionHistoryView } from "./_components/seller-commission-history-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Commission History | Seller Console",
  description: "View platform commission deductions and earnings history",
}

export default async function SellerCommissionHistoryPage() {
  const seller = await getCurrentSeller()
  const [settings, records] = await Promise.all([
    getSellerCommissionSettings(),
    seller ? getSellerCommissionLedger(seller) : Promise.resolve([]),
  ])

  return (
    <div className="p-4 md:p-6">
      <SellerCommissionHistoryView
        commissionType={settings.commissionType}
        rate={settings.fixedCommissionRate}
        records={records}
      />
    </div>
  )
}
