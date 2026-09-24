import React from "react"
import { Metadata } from "next"
import { getSmartBarSettings } from "@/services/settings-service"
import { SmartBarView } from "./_components/smart-bar-view"

export const metadata: Metadata = {
  title: "Smart Bar Configuration | Active eCommerce Admin",
}

export default async function AdminSmartBarPage() {
  const settings = await getSmartBarSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <SmartBarView initialSettings={settings} />
    </div>
  )
}
