import React from "react"
import { Metadata } from "next"
import { getCouriersSettings } from "@/services/courier-config-service"
import { CourierSettingsView } from "./_components/courier-settings-view"

export const metadata: Metadata = {
  title: "Courier & Logistics Integrations | Admin Control Panel",
  description: "Configure third-party delivery APIs for Steadfast, Pathao, RedX, and Paperfly.",
}

export const dynamic = "force-dynamic"

export default async function AdminCourierSettingsPage() {
  const settings = await getCouriersSettings()

  return <CourierSettingsView initialSettings={settings} />
}
