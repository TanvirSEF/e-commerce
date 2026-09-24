import React from "react"
import { Metadata } from "next"
import { getCustomAlertSettings } from "@/services/settings-service"
import { CustomAlertsView } from "./_components/custom-alerts-view"

export const metadata: Metadata = {
  title: "Custom Alerts | Admin Dashboard",
  description: "Configure custom sticky announcement alerts and promotions",
}

export default async function AdminCustomAlertsPage() {
  const settings = await getCustomAlertSettings()

  return (
    <div className="p-4 md:p-6">
      <CustomAlertsView initialSettings={settings} />
    </div>
  )
}
