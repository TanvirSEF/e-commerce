import React from "react"
import { getAppearanceSettings } from "@/services/appearance-service"
import { AppearanceSettingsView } from "./_components/appearance-settings-view"

export const metadata = {
  title: "Website Appearance & Branding | Admin Control Panel",
}

export const dynamic = "force-dynamic"

export default async function AdminAppearanceSettingsPage() {
  const settings = await getAppearanceSettings()

  return <AppearanceSettingsView initialSettings={settings} />
}
