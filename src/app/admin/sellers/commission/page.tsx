import React from "react"
import { getSellerCommissionSettings } from "@/services/settings-service"
import { CommissionSettingsView } from "./_components/commission-settings-view"

export const metadata = {
  title: "Seller Commission & Earnings Setup | Admin Panel",
}

export default async function AdminSellerCommissionPage() {
  const settings = await getSellerCommissionSettings()

  return <CommissionSettingsView initialSettings={settings} />
}
