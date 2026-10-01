import React from "react"
import { getAdminProfile } from "@/services/admin-profile-service"
import { getAddons } from "@/services/addon-service"
import { AdminShell } from "./_components/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [profile, allAddons] = await Promise.all([
    getAdminProfile(),
    getAddons(),
  ])
  const disabledAddons = allAddons.filter((a) => !a.activated).map((a) => a.uniqueIdentifier)

  return (
    <AdminShell initialProfile={profile} initialDisabledAddons={disabledAddons}>
      {children}
    </AdminShell>
  )
}
