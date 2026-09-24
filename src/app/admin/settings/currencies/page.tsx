import React from "react"
import { getCurrencySettings } from "@/services/settings-service"
import { CurrenciesSettingsView } from "./_components/currencies-settings-view"

export const metadata = {
  title: "Multi-Currency & Exchange Rates | Admin Panel",
}

export default async function AdminCurrenciesPage() {
  const settings = await getCurrencySettings()

  return <CurrenciesSettingsView initialSettings={settings} />
}
