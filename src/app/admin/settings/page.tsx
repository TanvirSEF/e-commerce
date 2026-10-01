import React from "react"
import { Metadata } from "next"
import { getGeneralSettings } from "@/services/settings-service"
import { AdminSettingsView } from "./_components/admin-settings-view"

export const metadata: Metadata = {
  title: "Website Settings | Admin Control Panel",
  description: "Configure general settings, currency, and contacts",
}

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings = await getGeneralSettings()
  return <AdminSettingsView initialSettings={settings} />
}
