import React from "react"
import { Metadata } from "next"
import { ThirdPartySettingsView } from "./_components/third-party-settings-view"

export const metadata: Metadata = {
  title: "Third-Party & Analytics Integrations | Admin Control Panel",
  description: "Configure Google Analytics, Google Maps, reCAPTCHA, and Facebook Pixel",
}

export default function ThirdPartySettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <ThirdPartySettingsView />
    </div>
  )
}
