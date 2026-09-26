import React from "react"
import { Metadata } from "next"
import { getPreorderSettings } from "@/services/preorder-service"
import { AdminPreorderSettingsView } from "./_components/admin-preorder-settings-view"

export const metadata: Metadata = {
  title: "Pre-Order Configuration | Admin Dashboard",
  description: "Configure systemwide pre-order deposits and policies",
}

export default async function AdminPreorderSettingsPage() {
  const settings = await getPreorderSettings()

  return (
    <div className="p-4 md:p-6">
      <AdminPreorderSettingsView initialSettings={settings} />
    </div>
  )
}
