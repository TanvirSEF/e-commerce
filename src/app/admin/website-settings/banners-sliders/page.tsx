import React from "react"
import { Metadata } from "next"
import { getBannersAndSlidersSettings } from "@/services/settings-service"
import { AdminBannersSlidersView } from "./_components/admin-banners-sliders-view"

export const metadata: Metadata = {
  title: "Banners & Sliders Configuration | Website Settings | Admin",
  description: "Configure promotional banners and sliders",
}

export default async function AdminBannersSlidersPage() {
  const settings = await getBannersAndSlidersSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <AdminBannersSlidersView initialSettings={settings} />
    </div>
  )
}
