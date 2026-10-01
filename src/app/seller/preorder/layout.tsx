import React from "react"
import { ensureAddonActivated } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export default async function SellerPreorderLayout({ children }: { children: React.ReactNode }) {
  await ensureAddonActivated("preorder_system")
  return <>{children}</>
}
