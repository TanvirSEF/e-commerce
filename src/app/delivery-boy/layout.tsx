import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export default async function DeliveryBoyLayout({ children }: { children: React.ReactNode }) {
  await ensureAddonActivated("delivery_boy_system")
  return <>{children}</>
}
