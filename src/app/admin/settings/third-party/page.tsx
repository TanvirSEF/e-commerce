import React from "react"
import { Metadata } from "next"
import { getThirdPartySettings } from "@/services/settings-service"
import { ThirdPartySettingsView } from "./_components/third-party-settings-view"

export const metadata: Metadata = {
  title: "Third-Party & Analytics Integrations | Admin Control Panel",
  description: "Configure Google Analytics, Google Maps, reCAPTCHA, and Facebook Pixel integrations",
}

export const dynamic = "force-dynamic"

export default async function ThirdPartySettingsPage() {
  const settings = await getThirdPartySettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <ThirdPartySettingsView initialSettings={settings} />
    </div>
  )
}
