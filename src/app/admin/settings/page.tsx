import React from "react"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { AdminSettingsView } from "./_components/admin-settings-view"

export const metadata: Metadata = {
  title: "Website Settings | Admin Control Panel",
  description: "Configure general settings, currency, and contacts",
}

export default function AdminSettingsPage() {
  const initialSettings = {
    siteName: siteConfig.name,
    siteMotto: siteConfig.motto,
    currencySymbol: siteConfig.currency.symbol,
    currencyCode: siteConfig.currency.code,
    helpline: siteConfig.helpline,
    email: siteConfig.email,
  }

  return <AdminSettingsView initialSettings={initialSettings} />
}
