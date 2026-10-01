import React from "react"
import { Metadata } from "next"
import { getThermalPrinterSettings } from "@/services/settings-service"
import { ThermalPrinterView } from "./_components/thermal-printer-view"

export const metadata: Metadata = {
  title: "Thermal Printer Configuration | Admin Control Panel",
  description: "Configure thermal invoice settings for receipt printing",
}

export const dynamic = "force-dynamic"

export default async function ThermalPrinterSettingsPage() {
  const settings = await getThermalPrinterSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <ThermalPrinterView initialSettings={settings} />
    </div>
  )
}
