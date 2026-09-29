import React from "react"
import { getAdminProfile } from "@/services/admin-profile-service"
import { AdminShell } from "./_components/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAdminProfile()

  return <AdminShell initialProfile={profile}>{children}</AdminShell>
}
