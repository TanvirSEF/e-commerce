import React from "react"
import { AdminAddonsView } from "./_components/admin-addons-view"
import { getAddons } from "@/services/addon-service"

export const metadata = {
  title: "Addon Manager | Admin Panel",
}

export default async function AdminAddonsPage() {
  const initialAddons = await getAddons()
  return <AdminAddonsView initialAddons={initialAddons} />
}
