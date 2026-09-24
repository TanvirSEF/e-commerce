import React from "react"
import type { Metadata } from "next"
import { getShippingLabelSettings } from "@/services/settings-service"
import { ShippingLabelSettingsView } from "./_components/shipping-label-settings-view"

export const metadata: Metadata = {
  title: "Shipping Label Settings | Admin | Active eCommerce",
  description: "Configure thermal shipping label layout and printing preferences in Active eCommerce CMS",
}

export default async function ShippingLabelSettingsPage() {
  const settings = await getShippingLabelSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ShippingLabelSettingsView initialSettings={settings} />
    </div>
  )
}
