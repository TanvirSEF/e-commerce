import React from "react"
import { Metadata } from "next"
import { getSeoSettings } from "@/services/settings-service"
import { SeoSettingsView } from "./_components/seo-settings-view"

export const metadata: Metadata = {
  title: "Global SEO Settings | Admin Dashboard",
  description: "Configure search engine optimization and social preview metadata",
}

export default async function AdminSeoSettingsPage() {
  const settings = await getSeoSettings()

  return (
    <div className="p-4 md:p-6">
      <SeoSettingsView initialSettings={settings} />
    </div>
  )
}
