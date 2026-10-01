import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export default async function AdminWholesaleLayout({ children }: { children: React.ReactNode }) {
  await ensureAddonActivated("wholesale_system")
  return <>{children}</>
}
