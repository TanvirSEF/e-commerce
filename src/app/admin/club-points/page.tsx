import React from "react"
import { getClubPointsSettings } from "@/services/settings-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { ClubPointsAdminView } from "./_components/club-points-admin-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Club Points & Loyalty Setup | Admin Panel",
}

export default async function AdminClubPointsPage() {
  await ensureAddonActivated("club_points")
  const settings = await getClubPointsSettings()

  return <ClubPointsAdminView initialSettings={settings} />
}
