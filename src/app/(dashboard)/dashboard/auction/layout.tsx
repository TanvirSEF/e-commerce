import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export default async function CustomerDashboardAuctionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureAddonActivated("auction_system")
  return <>{children}</>
}
