import React from "react"
import { getClubPointsSettings } from "@/services/settings-service"
import { ClubPointsAdminView } from "./_components/club-points-admin-view"

export const metadata = {
  title: "Club Points & Loyalty Setup | Admin Panel",
}

export default async function AdminClubPointsPage() {
  const settings = await getClubPointsSettings()

  return <ClubPointsAdminView initialSettings={settings} />
}
