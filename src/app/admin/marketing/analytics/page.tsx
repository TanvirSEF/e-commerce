import React from "react"
import { getAnalyticsSettings } from "@/services/analytics-service"
import { MarketingAnalyticsView } from "./_components/marketing-analytics-view"

export const metadata = {
  title: "Marketing Analytics & Tracking Pixels | Admin Panel",
}

export const dynamic = "force-dynamic"

export default async function AdminMarketingAnalyticsPage() {
  const settings = await getAnalyticsSettings()

  return <MarketingAnalyticsView initialSettings={settings} />
}
