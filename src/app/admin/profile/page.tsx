import React from "react"
import { getAdminProfile } from "@/services/admin-profile-service"
import { AdminProfileView } from "./_components/admin-profile-view"

export const metadata = {
  title: "Admin Profile & Security | Control Panel",
}

export const dynamic = "force-dynamic"

export default async function AdminProfilePage() {
  const profile = await getAdminProfile()

  return <AdminProfileView initialProfile={profile} />
}
