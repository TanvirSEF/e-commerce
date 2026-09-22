import React from "react"
import { getShippingSettings } from "@/services/settings-service"
import { ShippingSettingsView } from "./_components/shipping-settings-view"

export const metadata = {
  title: "Shipping Configuration | Active eCommerce Admin",
}

export default async function AdminShippingSettingsPage() {
  const settings = await getShippingSettings()

  return <ShippingSettingsView initialSettings={settings} />
}
