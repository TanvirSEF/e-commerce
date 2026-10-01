import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export default async function AdminAffiliateLayout({ children }: { children: React.ReactNode }) {
  await ensureAddonActivated("affiliate_system")
  return <>{children}</>
}
