import React from "react"
import { Metadata } from "next"
import { getPreorderBusinessSettings } from "@/services/preorder-service"
import { AdminPreorderSettingsView } from "./_components/admin-preorder-settings-view"

export const metadata: Metadata = {
  title: "Preorder Settings | Admin Control Panel",
  description: "Configure seller commission, preorder shipping, and request payment instructions",
}

export default async function AdminPreorderSettingsPage() {
  const settings = await getPreorderBusinessSettings()

  return (
    <div className="p-4 md:p-6">
      <AdminPreorderSettingsView initialSettings={settings} />
    </div>
  )
}
