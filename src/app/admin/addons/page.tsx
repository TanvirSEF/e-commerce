import React from "react"
import { Metadata } from "next"
import { AdminAddonsView } from "./_components/admin-addons-view"
import { getAddons, getAvailableAddons } from "@/services/addon-service"

export const metadata: Metadata = {
  title: "Addon Manager | Admin",
  description: "Manage installed CodeCanyon addons and explore available extensions",
}

export default async function AdminAddonsPage() {
  const [initialAddons, availableAddons] = await Promise.all([
    getAddons(),
    getAvailableAddons(),
  ])

  return (
    <AdminAddonsView
      initialAddons={initialAddons}
      availableAddons={availableAddons}
    />
  )
}
