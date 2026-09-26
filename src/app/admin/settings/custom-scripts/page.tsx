import React from "react"
import { Metadata } from "next"
import { getCustomScriptsSettings } from "@/services/settings-service"
import { CustomScriptsView } from "./_components/custom-scripts-view"

export const metadata: Metadata = {
  title: "Custom Scripts & Analytics | Admin Dashboard",
  description: "Configure third-party tracking scripts, GA4, GTM, and Meta Pixel",
}

export default async function AdminCustomScriptsPage() {
  const settings = await getCustomScriptsSettings()

  return (
    <div className="p-4 md:p-6">
      <CustomScriptsView initialSettings={settings} />
    </div>
  )
}
